#ifndef BITCOIN_IPC_INTERFACES_H
#define BITCOIN_IPC_INTERFACES_H

#include "amount.h" // For CAmount
#include "init.h"   // For HelpMessageMode

#include <memory>
#include <tuple>
#include <type_traits>
#include <vector>

class CNodeStats;
struct CNodeStateStats;

namespace ipc {

class Node;
class Wallet;
class Handler;

//! Top-level interface for a bitcoin node (bitcoind process).
class Node
{
public:
    virtual ~Node() {}

    //! Set command line arguments.
    virtual void parseParameters(int argc, const char* const argv[]) = 0;

    //! Set a command line argument if it doesn't already have a value
    virtual void softSetArg(const std::string& arg, const std::string& value) = 0;

    //! Set a command line boolean argument if it doesn't already have a value
    virtual void softSetBoolArg(const std::string& arg, bool value) = 0;

    //! Start node.
    virtual void readConfigFile(const std::string& confPath) = 0;

    //! Start node.
    virtual void selectParams(const std::string& network) = 0;

    //! Start node.
    virtual bool appInit() = 0;

    //! Stop node.
    virtual void appShutdown() = 0;

    //! Return whether shutdown was requested.
    virtual bool shutdownRequested() = 0;

    //! Get help message string.
    virtual std::string helpMessage(HelpMessageMode mode) = 0;

    //! Register handler for message box messages.
    using MessageBoxFn =
        std::function<bool(const std::string& message, const std::string& caption, unsigned int style)>;
    virtual std::unique_ptr<Handler> handleMessageBox(MessageBoxFn fn) = 0;

    //! Register handler for question messages.
    using QuestionFn = std::function<bool(const std::string& message,
        const std::string& nonInteractiveMessage,
        const std::string& caption,
        unsigned int style)>;
    virtual std::unique_ptr<Handler> handleQuestion(QuestionFn fn) = 0;

    //! Register handler for init messages.
    using InitMessageFn = std::function<void(const std::string& message)>;
    virtual std::unique_ptr<Handler> handleInitMessage(InitMessageFn fn) = 0;

    //! Register handler for number of connections changed messages.
    using NotifyNumConnectionsChangedFn = std::function<void(int newNumConnections)>;
    virtual std::unique_ptr<Handler> handleNotifyNumConnectionsChanged(NotifyNumConnectionsChangedFn fn) = 0;

    //! Register handler for network active messages.
    using NotifyNetworkActiveChangedFn = std::function<void(bool networkActive)>;
    virtual std::unique_ptr<Handler> handleNotifyNetworkActiveChanged(NotifyNetworkActiveChangedFn fn) = 0;

    //! Register handler for notify alert messages.
    using NotifyAlertChangedFn = std::function<void()>;
    virtual std::unique_ptr<Handler> handleNotifyAlertChanged(NotifyAlertChangedFn fn) = 0;

    //! Register handler for progress messages.
    using ShowProgressFn = std::function<void(const std::string& title, int progress)>;
    virtual std::unique_ptr<Handler> handleShowProgress(ShowProgressFn fn) = 0;

    //! Register handler for block tip messages.
    using NotifyBlockTipFn =
        std::function<void(bool initialDownload, int height, int64_t blockTime, double verificationProgress)>;
    virtual std::unique_ptr<Handler> handleNotifyBlockTip(NotifyBlockTipFn fn) = 0;

    //! Register handler for header tip messages.
    using NotifyHeaderTipFn =
        std::function<void(bool initialDownload, int height, int64_t blockTime, double verificationProgress)>;
    virtual std::unique_ptr<Handler> handleNotifyHeaderTip(NotifyHeaderTipFn fn) = 0;

    //! Register handler for ban list messages.
    using BannedListChangedFn = std::function<void()>;
    virtual std::unique_ptr<Handler> handleBannedListChanged(BannedListChangedFn fn) = 0;

    //! Get stats for connected nodes.
    using NodesStats = std::vector<std::tuple<CNodeStats, bool, CNodeStateStats>>;
    virtual bool getNodesStats(NodesStats& stats) = 0;

    //! Return Interface for accessing the wallet.
    virtual std::unique_ptr<Wallet> wallet() = 0;

    virtual void testInitMessage(const std::string& message) = 0;
};

//! Interface for calling wallet methods.
class Wallet
{
public:
    virtual ~Wallet() {}
    //! Return wallet balance.
    virtual CAmount getBalance() = 0;
};

//! Interface for managing a registered handler.
class Handler
{
public:
    virtual ~Handler() {}
    //! Disconnect the handler.
    virtual void disconnect() = 0;
};

//! Construct Node object.
std::unique_ptr<Node> MakeNode();

} // namespace ipc

#define ENABLE_IPC 1
#if ENABLE_IPC
#define FIXME_IMPLEMENT_IPC(x)
#define FIXME_IMPLEMENT_IPC_VALUE(x) (*(std::remove_reference<decltype(x)>::type*)(0))
#else
#define FIXME_IMPLEMENT_IPC(x) x
#define FIXME_IMPLEMENT_IPC_VALUE(x) x
#endif

#endif // BITCOIN_IPC_INTERFACES_H
