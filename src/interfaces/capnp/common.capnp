@0xcd2c6232cb484a28;

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("interfaces::capnp::messages");

using Proxy = import "/mp/proxy.capnp";

struct UniValue {
    # The current version of UniValue included in bitcoin doesn't support
    # round-trip serialization of raw values. After it gets updated, and
    # https://github.com/jgarzik/univalue/pull/31 is merged, this struct
    # can go away and UniValues can just be serialized as text using
    # UniValue::read() and UniValue::write() methods.

    type @0 :Int32;
    value @1 :Text;
}

struct GlobalArgs $Proxy.wrap("interfaces::capnp::GlobalArgs") $Proxy.count(0) {
   overrideArgs @0 :List(Pair(Text, List(Text))) $Proxy.name("m_override_args");
   configArgs @1 :List(Pair(Text, List(Text))) $Proxy.name("m_config_args");
   network @2 :Text $Proxy.name("m_network");
   networkOnlyArgs @3 :List(Text) $Proxy.name("m_network_only_args");
}

struct Pair(Key, Value) {
    key @0 :Key;
    value @1 :Value;
}

struct PairStr64 {
    key @0 :Text;
    value @1 :UInt64;
}
