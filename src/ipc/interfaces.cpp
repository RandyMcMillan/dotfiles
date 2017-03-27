#include <ipc/interfaces.h>

#include <chain.h>
#include <chainparams.h>
#include <init.h>
#include <ipc/util.h>
#include <net.h>
#include <net_processing.h>
#include <scheduler.h>
#include <ui_interface.h>
#include <util.h>
#include <validation.h>
#include <wallet/wallet.h>

#include <boost/thread.hpp>

namespace ipc {
namespace {

class HandlerImpl : public Handler
{
public:
    HandlerImpl(boost::signals2::connection connection) : connection(std::move(connection)) {}
    void disconnect() override { connection.disconnect(); }
    boost::signals2::scoped_connection connection;
};

class WalletImpl : public Wallet
{
public:
    WalletImpl(CWallet& wallet) : wallet(wallet) {}
    CAmount getBalance() override { return wallet.GetBalance(); }
    CWallet& wallet;
};

class NodeImpl : public Node
{
public:
    void parseParameters(int argc, const char* const argv[]) override { ::ParseParameters(argc, argv); }
    void softSetArg(const std::string& arg, const std::string& value) override { ::SoftSetArg(arg, value); }
    void softSetBoolArg(const std::string& arg, bool value) override { ::SoftSetBoolArg(arg, value); }
    void readConfigFile(const std::string& confPath) override { ::ReadConfigFile(confPath); }
    void selectParams(const std::string& network) override { ::SelectParams(network); }
    bool appInit() override
    {
        return ::AppInitBasicSetup() && ::AppInitParameterInteraction() && ::AppInitSanityChecks() &&
               ::AppInitMain(threadGroup, scheduler);
    }
    void appShutdown() override
    {
        ::Interrupt(threadGroup);
        threadGroup.join_all();
        ::Shutdown();
    }
    bool shutdownRequested() override { return ::ShutdownRequested(); }
    std::string helpMessage(HelpMessageMode mode) override { return ::HelpMessage(mode); }
    std::unique_ptr<Handler> handleMessageBox(MessageBoxFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(uiInterface.ThreadSafeMessageBox.connect(fn));
    }
    std::unique_ptr<Handler> handleQuestion(QuestionFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(uiInterface.ThreadSafeQuestion.connect(fn));
    }
    std::unique_ptr<Handler> handleInitMessage(InitMessageFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(uiInterface.InitMessage.connect(fn));
    }
    std::unique_ptr<Handler> handleNotifyNumConnectionsChanged(NotifyNumConnectionsChangedFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(uiInterface.NotifyNumConnectionsChanged.connect(fn));
    }
    std::unique_ptr<Handler> handleNotifyNetworkActiveChanged(NotifyNetworkActiveChangedFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(uiInterface.NotifyNetworkActiveChanged.connect(fn));
    }
    std::unique_ptr<Handler> handleNotifyAlertChanged(NotifyAlertChangedFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(uiInterface.NotifyAlertChanged.connect(fn));
    }
    std::unique_ptr<Handler> handleShowProgress(ShowProgressFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(uiInterface.ShowProgress.connect(fn));
    }
    std::unique_ptr<Handler> handleNotifyBlockTip(NotifyBlockTipFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(
            uiInterface.NotifyBlockTip.connect([fn](bool initialDownload, const CBlockIndex* block) {
                fn(initialDownload, block->nHeight, block->GetBlockTime(),
                    GuessVerificationProgress(Params().TxData(), block));
            }));
    }
    std::unique_ptr<Handler> handleNotifyHeaderTip(NotifyHeaderTipFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(
            uiInterface.NotifyHeaderTip.connect([fn](bool initialDownload, const CBlockIndex* block) {
                fn(initialDownload, block->nHeight, block->GetBlockTime(),
                    GuessVerificationProgress(Params().TxData(), block));
            }));
    }
    std::unique_ptr<Handler> handleBannedListChanged(BannedListChangedFn fn) override
    {
        return util::MakeUnique<HandlerImpl>(uiInterface.BannedListChanged.connect(fn));
    }
    bool getNodesStats(NodesStats& stats) override
    {
        stats.clear();

        if (g_connman) {
            std::vector<CNodeStats> statsTemp;
            g_connman->GetNodeStats(statsTemp);

            stats.reserve(statsTemp.size());
            for (auto& nodeStatsTemp : statsTemp) {
                stats.emplace_back(std::move(nodeStatsTemp), false, CNodeStateStats());
            }

            // Try to retrieve the CNodeStateStats for each node.
            TRY_LOCK(cs_main, lockMain);
            if (lockMain) {
                for (auto& nodeStats : stats) {
                    std::get<1>(nodeStats) = GetNodeStateStats(std::get<0>(nodeStats).nodeid, std::get<2>(nodeStats));
                }
            }
            return true;
        }
        return false;
    }
    std::unique_ptr<Wallet> wallet() override { return util::MakeUnique<WalletImpl>(*pwalletMain); }
    void testInitMessage(const std::string& message) override { uiInterface.InitMessage(message); }

    boost::thread_group threadGroup;
    ::CScheduler scheduler;
};

} // namespace

std::unique_ptr<Node> MakeNode() { return util::MakeUnique<NodeImpl>(); }

} // namespace ipc
