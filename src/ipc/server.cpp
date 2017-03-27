#include "ipc/server.h"

#include "ipc/interfaces.h"
#include "ipc/serialize.h"
#include "ipc/util.h"
#include "net_processing.h"

#include <capnp/rpc-twoparty.h>

namespace ipc {
namespace {

template <typename Client>
class HandlerServer final : public messages::Handler::Server
{
public:
    template <typename MakeImpl>
    HandlerServer(Client&& client, MakeImpl&& makeImpl) : client(std::move(client)), impl(makeImpl(this->client))
    {
    }

    kj::Promise<void> disconnect(DisconnectContext context) override
    {
        impl->disconnect();
        return kj::READY_NOW;
    }

    Client client;
    std::unique_ptr<Handler> impl;
};

template <typename Context, typename MakeConnection>
void SetHandler(Context& context, MakeConnection&& makeConnection)
{
    auto client = context.getParams().getCallback();
    using Server = HandlerServer<decltype(client)>;
    context.getResults().setHandler(
        messages::Handler::Client(kj::heap<Server>(std::move(client), std::forward<MakeConnection>(makeConnection))));
}

class WalletServer final : public messages::Wallet::Server
{
public:
    WalletServer(std::unique_ptr<Wallet> impl) : impl(std::move(impl)) {}

    kj::Promise<void> getBalance(GetBalanceContext context) override
    {
        context.getResults().setValue(impl->getBalance());
        return kj::READY_NOW;
    }

    std::unique_ptr<Wallet> impl;
};

class NodeServer final : public messages::Node::Server
{
public:
    NodeServer(util::EventLoop& loop) : loop(loop) {}

    kj::Promise<void> parseParameters(ParseParametersContext context) override
    {
        std::vector<const char*> argv(context.getParams().getArgv().size());
        size_t i = 0;
        for (const std::string& arg : context.getParams().getArgv()) {
            argv[i] = arg.c_str();
            ++i;
        }
        impl->parseParameters(argv.size(), argv.data());
        return kj::READY_NOW;
    }

    kj::Promise<void> softSetArg(SoftSetArgContext context) override
    {
        impl->softSetArg(context.getParams().getArg(), context.getParams().getValue());
        return kj::READY_NOW;
    }

    kj::Promise<void> softSetBoolArg(SoftSetBoolArgContext context) override
    {
        impl->softSetBoolArg(context.getParams().getArg(), context.getParams().getValue());
        return kj::READY_NOW;
    }

    kj::Promise<void> readConfigFile(ReadConfigFileContext context) override
    {
        try {
            impl->readConfigFile(context.getParams().getConfPath());
        } catch (const std::exception& e) {
            context.getResults().setError(e.what());
        }
        return kj::READY_NOW;
    }

    kj::Promise<void> selectParams(SelectParamsContext context) override
    {
        try {
            impl->selectParams(context.getParams().getNetwork());
        } catch (const std::exception& e) {
            context.getResults().setError(e.what());
        }
        return kj::READY_NOW;
    }

    kj::Promise<void> appInit(AppInitContext context) override
    {
        context.releaseParams();
        return loop.async(kj::mvCapture(context, [this](AppInitContext context) mutable {
            try {
                context.getResults().setValue(impl->appInit());
            } catch (std::exception& e) {
                context.getResults().setError(e.what());
            }
        }));
    }

    kj::Promise<void> appShutdown(AppShutdownContext context) override
    {
        impl->appShutdown();
        return kj::READY_NOW;
    }

    kj::Promise<void> shutdownRequested(ShutdownRequestedContext context) override
    {
        context.getResults().setValue(impl->shutdownRequested());
        return kj::READY_NOW;
    }

    kj::Promise<void> helpMessage(HelpMessageContext context) override
    {
        context.getResults().setValue(::HelpMessage(::HelpMessageMode(context.getParams().getMode())));
        return kj::READY_NOW;
    }

    kj::Promise<void> handleMessageBox(HandleMessageBoxContext context) override
    {
        SetHandler(context, [this](messages::MessageBoxCallback::Client& client) {
            return impl->handleMessageBox(
                [this, &client](const std::string& message, const std::string& caption, unsigned int style) {
                    auto call = util::MakeCall(this->loop, [&]() {
                        auto request = client.callRequest();
                        request.setMessage(message);
                        request.setCaption(caption);
                        request.setStyle(style);
                        return request;
                    });
                    return call.send([&]() { return call.response->getValue(); });
                });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleQuestion(HandleQuestionContext context) override
    {
        SetHandler(context, [this](messages::QuestionCallback::Client& client) {
            return impl->handleQuestion([this, &client](const std::string& message,
                const std::string& noninteractiveMessage, const std::string& caption, int style) {
                auto call = util::MakeCall(this->loop, [&]() {
                    auto request = client.callRequest();
                    request.setMessage(message);
                    request.setNoninteractiveMessage(noninteractiveMessage);
                    request.setCaption(caption);
                    request.setStyle(style);
                    return request;
                });
                return call.send([&]() { return call.response->getValue(); });
            });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleInitMessage(HandleInitMessageContext context) override
    {
        SetHandler(context, [this](messages::InitMessageCallback::Client& client) {
            return impl->handleInitMessage([this, &client](const std::string& message) {
                auto call = util::MakeCall(this->loop, [&]() {
                    auto request = client.callRequest();
                    request.setMessage(message);
                    return request;
                });
                return call.send();
            });
        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleNotifyNumConnectionsChanged(HandleNotifyNumConnectionsChangedContext context) override
    {
        SetHandler(context, [this](messages::NotifyNumConnectionsChangedCallback::Client& client) {
            return impl->handleNotifyNumConnectionsChanged([this, &client](int newNumConnections) {
                auto call = util::MakeCall(this->loop, [&]() {
                    auto request = client.callRequest();
                    request.setNewNumConnections(newNumConnections);
                    return request;
                });
                return call.send();
            });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleNotifyNetworkActiveChanged(HandleNotifyNetworkActiveChangedContext context) override
    {
        SetHandler(context, [this](messages::NotifyNetworkActiveChangedCallback::Client& client) {
            return impl->handleNotifyNetworkActiveChanged([this, &client](bool networkActive) {
                auto call = util::MakeCall(this->loop, [&]() {
                    auto request = client.callRequest();
                    request.setNetworkActive(networkActive);
                    return request;
                });
                return call.send();
            });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleNotifyAlertChanged(HandleNotifyAlertChangedContext context) override
    {
        SetHandler(context, [this](messages::NotifyAlertChangedCallback::Client& client) {
            return impl->handleNotifyAlertChanged([this, &client]() {
                auto call = util::MakeCall(this->loop, [&]() {
                    auto request = client.callRequest();
                    return request;
                });
                return call.send();
            });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleShowProgress(HandleShowProgressContext context) override
    {
        SetHandler(context, [this](messages::ShowProgressCallback::Client& client) {
            return impl->handleShowProgress([this, &client](const std::string& title, int nProgress) {
                auto call = util::MakeCall(this->loop, [&]() {
                    auto request = client.callRequest();
                    request.setTitle(title);
                    request.setProgress(nProgress);
                    return request;
                });
                return call.send();
            });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleNotifyBlockTip(HandleNotifyBlockTipContext context) override
    {
        SetHandler(context, [this](messages::NotifyBlockTipCallback::Client& client) {
            return impl->handleNotifyBlockTip(
                [this, &client](bool initialDownload, int height, int64_t blockTime, double verificationProgress) {
                    auto call = util::MakeCall(this->loop, [&]() {
                        auto request = client.callRequest();
                        request.setInitialDownload(initialDownload);
                        request.setHeight(height);
                        request.setBlockTime(blockTime);
                        request.setVerificationProgress(verificationProgress);
                        return request;
                    });
                    return call.send();
                });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleNotifyHeaderTip(HandleNotifyHeaderTipContext context) override
    {
        SetHandler(context, [this](messages::NotifyHeaderTipCallback::Client& client) {
            return impl->handleNotifyHeaderTip(
                [this, &client](bool initialDownload, int height, int64_t blockTime, double verificationProgress) {
                    auto call = util::MakeCall(this->loop, [&]() {
                        auto request = client.callRequest();
                        request.setInitialDownload(initialDownload);
                        request.setHeight(height);
                        request.setBlockTime(blockTime);
                        request.setVerificationProgress(verificationProgress);
                        return request;
                    });
                    return call.send();
                });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> handleBannedListChanged(HandleBannedListChangedContext context) override
    {
        SetHandler(context, [this](messages::BannedListChangedCallback::Client& client) {
            return impl->handleBannedListChanged([this, &client]() {
                auto call = util::MakeCall(this->loop, [&]() {
                    auto request = client.callRequest();
                    return request;
                });
                return call.send();
            });

        });
        return kj::READY_NOW;
    }

    kj::Promise<void> getNodesStats(GetNodesStatsContext context) override
    {
        Node::NodesStats stats;
        if (impl->getNodesStats(stats)) {
            auto resultStats = context.getResults().initStats(stats.size());
            size_t i = 0;
            for (const auto& nodeStats : stats) {
                serialize::BuildNodeStats(resultStats[i], std::get<0>(nodeStats));
                if (std::get<1>(nodeStats)) {
                    serialize::BuildNodeStateStats(resultStats[i].initStateStats(), std::get<2>(nodeStats));
                }
                ++i;
            }
        }
        return kj::READY_NOW;
    }

    kj::Promise<void> wallet(WalletContext context) override
    {
        context.getResults().setWallet(messages::Wallet::Client(kj::heap<WalletServer>(impl->wallet())));
        return kj::READY_NOW;
    }

    kj::Promise<void> testInitMessage(TestInitMessageContext context) override
    {
        return loop.async(kj::mvCapture(context, [this](TestInitMessageContext context) mutable {
            std::string message = serialize::ToString(context.getParams().getMessage());
            context.releaseParams();
            impl->testInitMessage(message);
        }));
    }

    util::EventLoop& loop;
    std::unique_ptr<Node> impl{MakeNode()};
};

} // namespace

bool StartServer(int argc, char* argv[], int& exitStatus)
{
    if (argc != 3 || strcmp(argv[1], "-ipcfd") != 0) {
        return false;
    }

    util::EventLoop loop;
    auto stream =
        loop.ioContext.lowLevelProvider->wrapSocketFd(atoi(argv[2]), kj::LowLevelAsyncIoProvider::TAKE_OWNERSHIP);
    auto network = capnp::TwoPartyVatNetwork(*stream, capnp::rpc::twoparty::Side::SERVER, capnp::ReaderOptions());
    auto rpcServer = capnp::makeRpcServer(network, capnp::Capability::Client(kj::heap<NodeServer>(loop)));
    loop.loop();
    exitStatus = EXIT_SUCCESS;
    return true;
}

} // namespace ipc
