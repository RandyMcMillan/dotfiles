Bitcoin Interprocess Communication
==================================

The IPC functions and classes in `src/ipc/` allow the `bitcoin-qt` process to
fork a `bitcoind` process and communicate with it over a socketpair. This gives
the `bitcoin-qt` code a bit of modularity, avoiding a monolithic architecture
where UI, P2P, wallet, consensus, and database code all runs in a single
process.

In the future, the IPC mechanism could be extended to allow other subdivisions
of functionality. For example, wallet code could run in a separate process from
P2P code. Also in the future, IPC sockets could also be exposed more publicly.
For example, exposed IPC server sockets could allow a `bitcoin-qt` process to
control a `bitcoind` process other than the one it spawns internally. These
changes would be straightforward to implement, but would create security,
backwards-compatibility, complexity, and maintainablity concerns, so would
require more discussion.


Implementation Details
----------------------

The IPC protocol used is _[Cap'n Proto](https://capnproto.org/)_, but this
protocol could be swapped out for another protocol (like JSON-RPC with long
polling) without changing code outside of the `src/ipc/` directory. No _Cap'n
Proto_ types are used in public headers.


### IPC Source Files ###

Here are the important files in the `src/ipc/` directory:


#### Public headers ####

* `interfaces.h` – Defines `ipc::Node`, `ipc::Wallet`, `ipc::Handler` interfaces.

* `client.h` – Declares `ipc::StartClient` function which spawns a `bitcoind`
               process and returns an `ipc::Node` object controlling it over a
               socket.

* `server.h` – Declares `ipc::StartServer` function which allows a `bitcoind`
               process to open a socket file descriptor and respond to remote
               commands.


#### Private headers and source files ####

* `interfaces.cpp` – In-process implementations of `ipc::Node`, `ipc::Wallet`,
                     and `ipc::Handler` interfaces.

* `client.cpp` – Out-of-process implementations of `ipc::Node`, `ipc::Wallet`,
                `ipc::Handler` interfaces that forward calls to a socket.

* `server.cpp` – Server IPC code responding to client requests.

* `messages.capnp` – IPC interface definition.

* `serialize.{h,cpp}` – Helper functions for translating IPC messages.

* `util.{h,cpp}` – Helper functions for making and receiving IPC calls.


### IPC Classes ###

* `ipc::Node` – public abstract base class describing an interface for
                controlling a `bitcoind` node. Defined in `interfaces.h`.

* `ipc::NodeImpl` – private concrete subclass of `ipc::Node` which implements
                    the node interface by calling `libbitcoin` functions in the
                    current `bitcoind` process. Defined in `interfaces.cpp`.

* `ipc::NodeClient` – private concrete subclass of `ipc::Node` which implements
                      the node interface by communicating with a `bitcoind`
                      instance over a socket. Defined in `client.cpp`.

* `ipc::messages::Node` – private [capnp interface](https://capnproto.org/language.html#interfaces)
                          describing communication across the IPC socket. Defined in
                          `messages.capnp`.

* `ipc::NodeServer` – private [capnp object](https://capnproto.org/rpc.html#distributed-objects)
                      implementing the `ipc::messages::Node` interface and
                      handling incoming requests by forwarding them to an
                      `ipc::NodeImpl` object. Defined in `server.cpp`.

`ipc::Wallet` and `ipc::Handler` are two other abstract interfaces similar to
`ipc::Node`, which allow an IPC client to keep track of wallets and callback
handlers, respectively. Both of these interfaces have corresponding private
`Impl`, `Client`, and `Server` subclasses just like `ipc::Node`.


### IPC Connection Setup Sequence ###

* IPC connection setup begins with an `ipc::StartClient()` call in `bitcoin-qt`.
  This creates a [socket pair](https://linux.die.net/man/3/socketpair) and
  spawns a `bitcoind` process to listen to one socket and an capnp event loop
  thread to listen to the other socket. Before returning, `StartClient`
  constructs an `ipc::NodeClient` object, which it returns to the caller so it
  can make IPC calls across the socket.

* When the `bitcoind` process starts, it calls `ipc::StartServer()`, which
  parses the command line to determine the socket file descriptor, then
  instantiates `ipc::NodeServer` and `ipc::NodeImpl` objects to handle requests
  from the socket. Finally it invokes the capnp event loop, which just sits idle
  until the first IPC request arrives.

### IPC Call Sequence Example ###

* When an IPC client calls the `NodeClient::getNodesStats()` method, the method
  will send a request over the IPC socket, triggering a call to
  `NodeServer::getNodesStats()` on the server, which will call
  `NodeImpl::getNodeStats()` to do the actual work.

### IPC Callback Sequence Example ###

* When an IPC client calls the `ipc::NodeClient::handleNotifyBlockTip()` method
  with a `std::function` argument, the method will first construct a
  `ipc::NotifyBlockTipCallbackServer` [capnp
  object](https://capnproto.org/rpc.html#distributed-objects) wrapping the
  `std::function`. It will then include a reference to this object inside the IPC
  request it sends to the server, so the server can call back to it.

* On the server side, the incoming IPC request will trigger a call to
  `ipc::NodeServer::handleNotifyBlockTip()` which will call
  `ipc::NodeImpl::handleNotifyBlockTip()`, passing the latter method a
  `std::function` will get registered to receive notifications. This server-side
  `std::function` will remotely invoke the
  `ipc::NotifyBlockTipCallbackServer::call()` method running in the client,
  which will invoke the original `std::function` passed to
  `ipc::NodeClient::handleNotifyBlockTip()` whenever there is a notification.

### Threading Notes ###

* Client methods like `ipc::NodeClient::getNodesStats()` will post work to the
  capnp event loop thread to send RPC requests and process responses, but will
  leave the event loop free to do other work between the sending the request and
  receiving the response. This means that multiple IPC requests can be ongoing
  simultaneously, and server callbacks will still continue to be processed.

* Server methods like `ipc::NodeServer::getNodesStats()` are called by _Cap'n
  Proto_ from the event loop thread, so it is important that they either run
  very quickly without blocking, or use an asynchronous mechanism like the
  `ipc::util::EventLoop::async()` helper to avoid tying up the server and
  preventing it from processing requests and sending notifications while the
  call is running. `ipc::NodeServer::appInit()` is an example of a slow IPC
  method that runs asynchronously using the async helper.

* Callback methods like `ipc::NotifyBlockTipCallbackServer::call()` are similar
  to server methods, and are also called from the event loop thread by _Cap'n
  Proto_. If they are blocking or slow, they also need to be implemented using
  an async mechanism to avoid slowing down other calls and notifications.
