#include <interfaces/init.h>

#include <interfaces/chain.h>
#include <interfaces/node.h>
#include <interfaces/wallet.h>

#if defined(HAVE_CONFIG_H)
#include <config/bitcoin-config.h>
#endif

namespace interfaces {
namespace {
class LocalInitImpl : public LocalInit
{
public:
    LocalInitImpl(InitInterfaces& interfaces)
        : LocalInit(/* exe_name */ "bitcoin-qt", /* log_suffix= */ nullptr), m_interfaces(interfaces)
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

std::unique_ptr<LocalInit> MakeGuiInit(int argc, char* argv[], InitInterfaces& interfaces)
{
    return MakeUnique<LocalInitImpl>(interfaces);
}
} // namespace interfaces
