// Copyright (c) 2021 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_IPC_CAPNP_CONTEXT_H
#define BITCOIN_IPC_CAPNP_CONTEXT_H

#include <ipc/context.h>

namespace ipc {
namespace capnp {
struct Context : ipc::Context
{
};
} // namespace capnp
} // namespace ipc

#endif // BITCOIN_IPC_CAPNP_CONTEXT_H
