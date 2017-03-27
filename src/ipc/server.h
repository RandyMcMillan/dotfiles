#ifndef BITCOIN_IPC_SERVER_H
#define BITCOIN_IPC_SERVER_H

namespace ipc {

//! Start IPC server if requested on command line.
bool StartServer(int argc, char* argv[], int& exitStatus);

} // namespace ipc

#endif // BITCOIN_IPC_SERVER_H
