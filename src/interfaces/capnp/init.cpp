#include <init.h>
#include <interfaces/capnp/init-types.h>
#include <interfaces/init.h>
#include <rpc/util.h>

namespace mp {
std::unique_ptr<interfaces::ChainClient>
ProxyServerMethodTraits<interfaces::capnp::messages::Init::MakeWalletClientParams>::invoke(Context& context,
    std::vector<std::string> wallet_filenames)
{
    interfaces::LocalInit& init = *static_cast<interfaces::LocalInit*>(context.connection.m_loop.m_context);
    init.startServer();
    auto params = context.call_context.getParams();
    auto interfaces = MakeUnique<InitInterfaces>();
    g_rpc_interfaces = interfaces.get();
    interfaces->chain = MakeUnique<ProxyClient<interfaces::capnp::messages::Chain>>(
        params.getChain(), &context.proxy_server.m_connection, /* destroy_connection= */ false);
    auto client = context.proxy_server.m_impl->makeWalletClient(*interfaces->chain, std::move(wallet_filenames));
    client->addCloseHook(MakeUnique<interfaces::Deleter<std::unique_ptr<InitInterfaces>>>(std::move(interfaces)));
    return client;
}
} // namespace mp
