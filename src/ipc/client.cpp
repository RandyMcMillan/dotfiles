#include "ipc/client.h"

#include "bitcoin-config.h"
#include "ipc/interfaces.h"
#include "ipc/messages.capnp.h"
#include "ipc/serialize.h"
#include "ipc/util.h"
#include "net_processing.h"

#include <capnp/rpc-twoparty.h>
#include <kj/async-unix.h>
#include <kj/debug.h>

#include <future>
#include <mutex>
#include <thread>

#include <sys/resource.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

namespace ipc {
namespace {

class MessageBoxCallbackServer final : public messages::MessageBoxCallback::Server
{
public:
    MessageBoxCallbackServer(Node::MessageBoxFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn(context.getParams().getMessage(), context.getParams().getCaption(), context.getParams().getStyle());
        return kj::READY_NOW;
    }
    Node::MessageBoxFn fn;
};

class QuestionCallbackServer final : public messages::QuestionCallback::Server
{
public:
    QuestionCallbackServer(Node::QuestionFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn(context.getParams().getMessage(), context.getParams().getNoninteractiveMessage(),
            context.getParams().getCaption(), context.getParams().getStyle());
        return kj::READY_NOW;
    }
    Node::QuestionFn fn;
};

class InitMessageCallbackServer final : public messages::InitMessageCallback::Server
{
public:
    InitMessageCallbackServer(Node::InitMessageFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn(context.getParams().getMessage());
        return kj::READY_NOW;
    }
    Node::InitMessageFn fn;
};

class NotifyNumConnectionsChangedCallbackServer final : public messages::NotifyNumConnectionsChangedCallback::Server
{
public:
    NotifyNumConnectionsChangedCallbackServer(Node::NotifyNumConnectionsChangedFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn(context.getParams().getNewNumConnections());
        return kj::READY_NOW;
    }
    Node::NotifyNumConnectionsChangedFn fn;
};

class NotifyNetworkActiveChangedCallbackServer final : public messages::NotifyNetworkActiveChangedCallback::Server
{
public:
    NotifyNetworkActiveChangedCallbackServer(Node::NotifyNetworkActiveChangedFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn(context.getParams().getNetworkActive());
        return kj::READY_NOW;
    }
    Node::NotifyNetworkActiveChangedFn fn;
};

class NotifyAlertChangedCallbackServer final : public messages::NotifyAlertChangedCallback::Server
{
public:
    NotifyAlertChangedCallbackServer(Node::NotifyAlertChangedFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn();
        return kj::READY_NOW;
    }
    Node::NotifyAlertChangedFn fn;
};

class ShowProgressCallbackServer final : public messages::ShowProgressCallback::Server
{
public:
    ShowProgressCallbackServer(Node::ShowProgressFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn(context.getParams().getTitle(), context.getParams().getProgress());
        return kj::READY_NOW;
    }
    Node::ShowProgressFn fn;
};

class NotifyBlockTipCallbackServer final : public messages::NotifyBlockTipCallback::Server
{
public:
    NotifyBlockTipCallbackServer(Node::NotifyBlockTipFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn(context.getParams().getInitialDownload(), context.getParams().getHeight(),
           context.getParams().getBlockTime(), context.getParams().getVerificationProgress());
        return kj::READY_NOW;
    }
    Node::NotifyBlockTipFn fn;
};

class NotifyHeaderTipCallbackServer final : public messages::NotifyHeaderTipCallback::Server
{
public:
    NotifyHeaderTipCallbackServer(Node::NotifyHeaderTipFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn(context.getParams().getInitialDownload(), context.getParams().getHeight(),
           context.getParams().getBlockTime(), context.getParams().getVerificationProgress());
        return kj::READY_NOW;
    }
    Node::NotifyHeaderTipFn fn;
};

class BannedListChangedCallbackServer final : public messages::BannedListChangedCallback::Server
{
public:
    BannedListChangedCallbackServer(Node::BannedListChangedFn fn) : fn(std::move(fn)) {}
    kj::Promise<void> call(CallContext context) override
    {
        fn();
        return kj::READY_NOW;
    }
    Node::BannedListChangedFn fn;
};

class HandlerClient : public Handler
{
public:
    HandlerClient(util::EventLoop& loop, messages::Handler::Client client) : loop(loop), client(std::move(client)) {}
    ~HandlerClient() noexcept override {}

    void disconnect() override
    {
        auto call = util::MakeCall(loop, [&]() { return client.disconnectRequest(); });
        return call.send();
    }

    util::EventLoop& loop;
    messages::Handler::Client client;
};

class WalletClient : public Wallet
{
public:
    WalletClient(util::EventLoop& loop, messages::Wallet::Client client) : loop(loop), client(std::move(client)) {}
    ~WalletClient() noexcept override {}

    CAmount getBalance() override
    {
        auto call = util::MakeCall(loop, [&]() { return client.getBalanceRequest(); });
        return call.send([&] { return call.response->getValue(); });
    }

    util::EventLoop& loop;
    messages::Wallet::Client client;
};

//! VatId for server side of IPC connection.
struct ServerVatId
{
    capnp::word scratch[4]{};
    capnp::MallocMessageBuilder message{scratch};
    capnp::rpc::twoparty::VatId::Builder vatId{message.getRoot<capnp::rpc::twoparty::VatId>()};
    ServerVatId() { vatId.setSide(capnp::rpc::twoparty::Side::SERVER); }
};

class NodeClient : public Node
{
public:
    NodeClient(util::EventLoop& loop, int fd)
        : loop(loop),
          stream(loop.ioContext.lowLevelProvider->wrapSocketFd(fd, kj::LowLevelAsyncIoProvider::TAKE_OWNERSHIP)) {}
    ~NodeClient() noexcept override {}

    void parseParameters(int argc, const char* const argv[]) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.parseParametersRequest();
            auto args = request.initArgv(argc);
            for (int i = 0; i < argc; ++i) {
                args.set(i, argv[i]);
            }
            return request;
        });
        return call.send();
    }

    void softSetArg(const std::string& arg, const std::string& value) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.softSetArgRequest();
            request.setArg(arg);
            request.setValue(value);
            return request;
        });
        return call.send();
    }

    void softSetBoolArg(const std::string& arg, bool value) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.softSetBoolArgRequest();
            request.setArg(arg);
            request.setValue(value);
            return request;
        });
        return call.send();
    }

    void readConfigFile(const std::string& confPath) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.readConfigFileRequest();
            request.setConfPath(confPath);
            return request;
        });
        call.send([&]() {
            if (call.response->hasError()) {
                throw std::runtime_error(serialize::ToString(call.response->getError()));
            }
        });
    }

    void selectParams(const std::string& network) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.selectParamsRequest();
            request.setNetwork(network);
            return request;
        });
        call.send([&]() {
            if (call.response->hasError()) {
                throw std::runtime_error(serialize::ToString(call.response->getError()));
            }
        });
    }

    std::string helpMessage(HelpMessageMode mode) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.helpMessageRequest();
            request.setMode(mode);
            return request;
        });
        return call.send([&]() { return call.response->getValue(); });
    }

    bool appInit() override
    {
        auto call = util::MakeCall(loop, [&]() { return client.appInitRequest(); });
        return call.send([&]() {
            if (call.response->hasError()) {
                throw std::runtime_error(serialize::ToString(call.response->getError()));
            }
            return call.response->getValue();
        });
    }

    void appShutdown() override
    {
        auto call = util::MakeCall(loop, [&]() { return client.appShutdownRequest(); });
        return call.send();
    }

    bool shutdownRequested() override
    {
        auto call = util::MakeCall(loop, [&]() { return client.shutdownRequestedRequest(); });
        return call.send([&]() { return call.response->getValue(); });
    }

    std::unique_ptr<Handler> handleMessageBox(MessageBoxFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleMessageBoxRequest();
            request.setCallback(kj::heap<MessageBoxCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleQuestion(QuestionFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleQuestionRequest();
            request.setCallback(kj::heap<QuestionCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleInitMessage(InitMessageFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleInitMessageRequest();
            request.setCallback(kj::heap<InitMessageCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleNotifyNumConnectionsChanged(NotifyNumConnectionsChangedFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleNotifyNumConnectionsChangedRequest();
            request.setCallback(kj::heap<NotifyNumConnectionsChangedCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleNotifyNetworkActiveChanged(NotifyNetworkActiveChangedFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleNotifyNetworkActiveChangedRequest();
            request.setCallback(kj::heap<NotifyNetworkActiveChangedCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleNotifyAlertChanged(NotifyAlertChangedFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleNotifyAlertChangedRequest();
            request.setCallback(kj::heap<NotifyAlertChangedCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleShowProgress(ShowProgressFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleShowProgressRequest();
            request.setCallback(kj::heap<ShowProgressCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleNotifyBlockTip(NotifyBlockTipFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleNotifyBlockTipRequest();
            request.setCallback(kj::heap<NotifyBlockTipCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleNotifyHeaderTip(NotifyHeaderTipFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleNotifyHeaderTipRequest();
            request.setCallback(kj::heap<NotifyHeaderTipCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    std::unique_ptr<Handler> handleBannedListChanged(BannedListChangedFn fn) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.handleBannedListChangedRequest();
            request.setCallback(kj::heap<BannedListChangedCallbackServer>(std::move(fn)));
            return request;
        });
        return call.send([&]() { return util::MakeUnique<HandlerClient>(loop, call.response->getHandler()); });
    }

    bool getNodesStats(NodesStats& stats) override
    {
        auto call = util::MakeCall(loop, [&]() { return client.getNodesStatsRequest(); });
        return call.send([&]() {
            if (call.response->hasStats()) {
                auto resultStats = call.response->getStats();
                stats.reserve(resultStats.size());
                for (const auto& resultNodeStats : resultStats) {
                    stats.emplace_back(CNodeStats(), false, CNodeStateStats());
                    serialize::ReadNodeStats(std::get<0>(stats.back()), resultNodeStats);
                    if (resultNodeStats.hasStateStats()) {
                        std::get<1>(stats.back()) = true;
                        serialize::ReadNodeStateStats(std::get<2>(stats.back()), resultNodeStats.getStateStats());
                    }
                }
                return true;
            }
            return false;
        });
    }

    std::unique_ptr<Wallet> wallet() override
    {
        auto call = util::MakeCall(loop, [&]() { return client.walletRequest(); });
        return call.send([&]() { return util::MakeUnique<WalletClient>(loop, call.response->getWallet()); });
    }

    void testInitMessage(const std::string& message) override
    {
        auto call = util::MakeCall(loop, [&]() {
            auto request = client.testInitMessageRequest();
            request.setMessage(message);
            return request;
        });
        return call.send();
    }

    util::EventLoop& loop;
    kj::Own<kj::AsyncIoStream> stream;
    capnp::TwoPartyVatNetwork network{*stream, capnp::rpc::twoparty::Side::CLIENT, capnp::ReaderOptions()};
    capnp::RpcSystem<capnp::rpc::twoparty::VatId> rpcClient{capnp::makeRpcClient(network)};
    messages::Node::Client client{rpcClient.bootstrap(ServerVatId().vatId).castAs<messages::Node>()};
};

//! Return highest possible file descriptor.
size_t MaxFd()
{
    struct rlimit nofile;
    if (getrlimit(RLIMIT_NOFILE, &nofile) == 0) {
        return nofile.rlim_cur - 1;
    } else {
        return 1023;
    }
}

} // namespace

std::unique_ptr<Node> StartClient()
{
    int fds[2];
    KJ_SYSCALL(socketpair(AF_UNIX, SOCK_STREAM, 0, fds));

    if (fork() == 0) {
        int maxFd = MaxFd();
        for (int fd = 3; fd < maxFd; ++fd) {
            if (fd != fds[0]) {
                close(fd);
            }
        }
        if (execlp(BITCOIN_DAEMON_NAME, BITCOIN_DAEMON_NAME, "-ipcfd", std::to_string(fds[0]).c_str(), nullptr) != 0) {
            perror("execlp '" BITCOIN_DAEMON_NAME "' failed");
            _exit(1);
        }
    }

    std::promise<util::EventLoop*> loopPromise;
    std::thread thread([&loopPromise, &thread]() {
        util::EventLoop loop(std::move(thread));
        loopPromise.set_value(&loop);
        loop.loop();
    });
    util::EventLoop* loop = loopPromise.get_future().get();

    std::promise<std::unique_ptr<Node>> nodePromise;
    loop->sync([&] { nodePromise.set_value(util::MakeUnique<NodeClient>(*loop, fds[1])); });
    return nodePromise.get_future().get();
}

} // namespace ipc
