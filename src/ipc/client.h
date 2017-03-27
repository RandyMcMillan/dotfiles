#ifndef BITCOIN_IPC_CLIENT_H
#define BITCOIN_IPC_CLIENT_H

#include <memory>

namespace ipc {

class Node;

//! Start IPC client and return top level Node object.
std::unique_ptr<Node> StartClient();

} // namespace ipc

#endif // BITCOIN_IPC_CLIENT_H
