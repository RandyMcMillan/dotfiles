#ifndef BITCOIN_INTERFACES_INIT_H
#define BITCOIN_INTERFACES_INIT_H

#include <functional>
#include <memory>
#include <string>
#include <vector>

struct InitInterfaces;

namespace interfaces {
class Base;
class Chain;
class ChainClient;
class IpcProcess;
class IpcProtocol;
class Node;
struct NodeClientParam;
struct NodeServerParam;

//! Interface allowing multiprocess code to create other interfaces on startup.
class Init
{
public:
    virtual ~Init() = default;
    virtual std::unique_ptr<Node> makeNode() = 0;
    virtual std::unique_ptr<Chain> makeChain() = 0;
    virtual std::unique_ptr<ChainClient> makeWalletClient(Chain& chain, std::vector<std::string> wallet_filenames) = 0;
};

//! Specialization of Init for current process.
class LocalInit : public Init
{
public:
    LocalInit(const char* exe_name, const char* log_suffix);
    ~LocalInit() override;
    std::unique_ptr<Node> makeNode() override { return {}; }
    std::unique_ptr<Chain> makeChain() override { return {}; }
    std::unique_ptr<ChainClient> makeWalletClient(Chain& chain, std::vector<std::string> wallet_filenames) override
    {
        return {};
    }
    void spawnProcess(const std::string& new_exe_name, std::function<Base&(Init&)>&& make_interface);
    virtual void startServer() {}
    virtual void makeNodeServer(NodeServerParam&) {}
    virtual void makeNodeClient(NodeClientParam&) {}
    const char* m_exe_name;
    const char* m_log_suffix;
    std::unique_ptr<IpcProtocol> m_protocol;
    std::unique_ptr<IpcProcess> m_process;
};

//! Create interface pointers used by current process.
//! Different implementations exist for different executables.
std::unique_ptr<LocalInit> MakeGuiInit(int argc, char* argv[], InitInterfaces& interfaces);
std::unique_ptr<LocalInit> MakeNodeInit(int argc, char* argv[], InitInterfaces& interfaces);
std::unique_ptr<LocalInit> MakeWalletInit(int argc, char* argv[]);

void DebugStop(int argc, char* argv[], const char* exe_name);
} // namespace interfaces

#endif // BITCOIN_INTERFACES_INIT_H
