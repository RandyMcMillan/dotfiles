#ifndef BITCOIN_INTERFACES_CAPNP_COMMON_H
#define BITCOIN_INTERFACES_CAPNP_COMMON_H

#include <interfaces/capnp/common.capnp.h>
#include <util/system.h>

class RPCTimerInterface;

namespace mp {
class InvokeContext;
} // namespace mp

namespace interfaces {
namespace capnp {

//! Wrapper around GlobalArgs struct to expose public members.
struct GlobalArgs : public ArgsManager
{
    using ArgsManager::cs_args;
    using ArgsManager::m_config_args;
    using ArgsManager::m_network;
    using ArgsManager::m_network_only_args;
    using ArgsManager::m_override_args;
};

//! GlobalArgs client-side argument handling. Builds message from ::gArgs variable.
void BuildGlobalArgs(mp::InvokeContext& invoke_context, messages::GlobalArgs::Builder&& builder);

//! GlobalArgs server-side argument handling. Reads message into ::gArgs variable.
void ReadGlobalArgs(mp::InvokeContext& invoke_context, const messages::GlobalArgs::Reader& reader);

//! GlobalArgs network string accessor.
std::string GlobalArgsNetwork();

} // namespace capnp
} // namespace interfaces

#endif // BITCOIN_INTERFACES_CAPNP_COMMON_H
