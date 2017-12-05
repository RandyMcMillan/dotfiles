#include <interfaces/init.h>

#include <interfaces/chain.h>
#include <interfaces/ipc.h>
#include <interfaces/node.h>
#include <interfaces/wallet.h>
#include <logging.h>
#include <util/memory.h>

#if defined(HAVE_CONFIG_H)
#include <config/bitcoin-config.h>
#endif

namespace interfaces {
namespace {
class LocalInitImpl : public LocalInit
{
public:
    LocalInitImpl(InitInterfaces& interfaces)
        : LocalInit(/* exe_name= */ "bitcoind", /* log_suffix= */ nullptr), m_interfaces(interfaces)
    {
    }
    std::unique_ptr<Node> makeNode() override { return MakeNode(m_interfaces); }
    std::unique_ptr<Chain> makeChain() override { return MakeChain(); }
    std::unique_ptr<ChainClient> makeWalletClient(Chain& chain, std::vector<std::string> wallet_filenames) override
    {
#if ENABLE_WALLET
        return MakeWalletClient(chain, std::move(wallet_filenames));
#else
        return {}
#endif
    }
    InitInterfaces& m_interfaces;
};
} // namespace

std::unique_ptr<LocalInit> MakeNodeInit(int argc, char* argv[], InitInterfaces& interfaces)
{
    return MakeUnique<LocalInitImpl>(interfaces);
}
} // namespace interfaces
