#ifndef BITCOIN_INTERFACES_CAPNP_NODE_H
#define BITCOIN_INTERFACES_CAPNP_NODE_H

#include <interfaces/capnp/node.capnp.h>
#include <interfaces/node.h>
#include <mp/proxy.h>
#include <rpc/server.h>
#include <scheduler.h>

#include <memory>
#include <string>

class RPCTimerInterface;

//! Specialization of Node proxy server needed to add m_timer_interface
//! member used by rpcSetTimerInterfaceIfUnset and rpcUnsetTimerInterface
//! methods.
template <>
struct mp::ProxyServerCustom<interfaces::capnp::messages::Node, interfaces::Node>
    : public mp::ProxyServerBase<interfaces::capnp::messages::Node, interfaces::Node>
{
public:
    using ProxyServerBase::ProxyServerBase;
    std::unique_ptr<::RPCTimerInterface> m_timer_interface;
};

#endif // BITCOIN_INTERFACES_CAPNP_NODE_H
