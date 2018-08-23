#ifndef BITCOIN_INTERFACES_CAPNP_INIT_TYPES_H
#define BITCOIN_INTERFACES_CAPNP_INIT_TYPES_H

#include <interfaces/capnp/chain-types.h>
#include <interfaces/capnp/node-types.h>

namespace mp {
//! Specialization of makeNode which calls InitLogging, etc if node is being
//! created in a new process.
template <>
struct ProxyServerMethodTraits<interfaces::capnp::messages::Init::MakeNodeParams>
{
    using Context = ServerContext<interfaces::capnp::messages::Init,
        interfaces::capnp::messages::Init::MakeNodeParams,
        interfaces::capnp::messages::Init::MakeNodeResults>;
    static std::unique_ptr<interfaces::Node> invoke(Context& context);
};

//! Specialization of makeWalletClient needed because it takes a Chain& reference
//! argument, not a unique_ptr<Chain> argument, so a manual addCloseHook()
//! callback is needed to clean up the ProxyServer<messages::Chain> proxy object.
//! Also used as a hook to call AppInitXXX functions in newly created wallet
//! processes, after deserializing GlobalArgs.
template <>
struct ProxyServerMethodTraits<interfaces::capnp::messages::Init::MakeWalletClientParams>
{
    using Context = ServerContext<interfaces::capnp::messages::Init,
        interfaces::capnp::messages::Init::MakeWalletClientParams,
        interfaces::capnp::messages::Init::MakeWalletClientResults>;
    static std::unique_ptr<interfaces::ChainClient> invoke(Context& context,
        std::vector<std::string> wallet_filenames);
};
} // namespace mp

#endif // BITCOIN_INTERFACES_CAPNP_INIT_TYPES_H
