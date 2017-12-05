@0xebd8f46e2f369076;

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("interfaces::capnp::messages");

using Proxy = import "/mp/proxy.capnp";

interface Handler $Proxy.wrap("interfaces::Handler") {
    destroy @0 (context :Proxy.Context) -> ();
    disconnect @1 (context :Proxy.Context) -> ();
}