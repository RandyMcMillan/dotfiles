#include <interfaces/init.h>

#include <chainparams.h>
#include <init.h>
#include <interfaces/capnp/ipc.h>
#include <interfaces/chain.h>
#include <interfaces/node.h>

namespace interfaces {
void MakeProxy(NodeServerParam&);
namespace {
class LocalInitImpl : public LocalInit
{
public:
    LocalInitImpl(int argc, char* argv[], InitInterfaces& interfaces)
        : LocalInit(/* exe_name */ "bitcoin-node", /* log_suffix= */ nullptr), m_interfaces(interfaces)
    {
        m_protocol = capnp::MakeCapnpProtocol(m_exe_name, *this);
        m_process = MakeIpcProcess(argc, argv, m_exe_name, *m_protocol);
    }
    std::unique_ptr<Node> makeNode() override { return MakeNode(m_interfaces); }
    std::unique_ptr<Chain> makeChain() override { return MakeChain(); }
    std::unique_ptr<ChainClient> makeWalletClient(Chain& chain, std::vector<std::string> wallet_filenames) override
    {
        std::unique_ptr<ChainClient> wallet;
        spawnProcess("bitcoin-wallet", [&](Init& init) -> Base& {
            wallet = init.makeWalletClient(chain, std::move(wallet_filenames));
            return *wallet;
        });
        return wallet;
    }
    void makeNodeServer(NodeServerParam& param) override { MakeProxy(param); }
    InitInterfaces& m_interfaces;
};
} // namespace

std::unique_ptr<LocalInit> MakeNodeInit(int argc, char* argv[], InitInterfaces& interfaces)
{
    return MakeUnique<LocalInitImpl>(argc, argv, interfaces);
}
} // namespace interfaces
