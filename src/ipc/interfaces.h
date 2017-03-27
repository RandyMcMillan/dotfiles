#ifndef BITCOIN_IPC_INTERFACES_H
#define BITCOIN_IPC_INTERFACES_H

#include <type_traits>

#define ENABLE_IPC 1
#if ENABLE_IPC
#define FIXME_IMPLEMENT_IPC(x)
#define FIXME_IMPLEMENT_IPC_VALUE(x) (*(std::remove_reference<decltype(x)>::type*)(0))
#else
#define FIXME_IMPLEMENT_IPC(x) x
#define FIXME_IMPLEMENT_IPC_VALUE(x) x
#endif

#endif // BITCOIN_IPC_INTERFACES_H
