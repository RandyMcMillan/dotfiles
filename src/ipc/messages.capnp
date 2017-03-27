@0xa4478fe5ad6d80f5;

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("ipc::messages");

interface Node {
    parseParameters @0 (argv :List(Text)) -> ();
    softSetArg @1 (arg :Text, value :Text) -> ();
    softSetBoolArg @2 (arg :Text, value :Bool) -> ();
    readConfigFile @3 (confPath :Text) -> (error :Text);
    selectParams @4 (network :Text) -> (error :Text);
    appInit @5 () -> (value :Bool, error: Text);
    appShutdown @6 () -> ();
    shutdownRequested @7 () -> (value: Bool);
    helpMessage @8 (mode :Int32) -> (value :Text);
    handleMessageBox @9 (callback: MessageBoxCallback) -> (handler :Handler);
    handleQuestion @10 (callback: QuestionCallback) -> (handler :Handler);
    handleInitMessage @11 (callback: InitMessageCallback) -> (handler :Handler);
    handleNotifyNumConnectionsChanged @12 (callback: NotifyNumConnectionsChangedCallback) -> (handler :Handler);
    handleNotifyNetworkActiveChanged @13 (callback: NotifyNetworkActiveChangedCallback) -> (handler :Handler);
    handleNotifyAlertChanged @14 (callback: NotifyAlertChangedCallback) -> (handler :Handler);
    handleShowProgress @15 (callback: ShowProgressCallback) -> (handler :Handler);
    handleNotifyBlockTip @16 (callback: NotifyBlockTipCallback) -> (handler :Handler);
    handleNotifyHeaderTip @17 (callback: NotifyHeaderTipCallback) -> (handler :Handler);
    handleBannedListChanged @18 (callback: BannedListChangedCallback) -> (handler :Handler);
    getNodesStats @19 () -> (stats :List(NodeStats));
    wallet @20 () -> (wallet :Wallet);

    testInitMessage @21 (message :Text) -> ();
}

interface Wallet {
    getBalance @0 () -> (value :Int64);
}

interface Handler {
    disconnect @0 () -> ();
}

interface MessageBoxCallback {
    call @0 (message :Text, caption :Text, style :UInt32) -> (value :Bool);
}

interface QuestionCallback {
    call @0 (message :Text, noninteractiveMessage :Text, caption :Text, style :UInt32) -> (value :Bool);
}

interface InitMessageCallback {
    call @0 (message :Text) -> ();
}

interface NotifyNumConnectionsChangedCallback {
    call @0 (newNumConnections :Int32) -> ();
}

interface NotifyNetworkActiveChangedCallback {
    call @0 (networkActive :Bool) -> ();
}

interface NotifyAlertChangedCallback {
    call @0 () -> ();
}

interface ShowProgressCallback {
    call @0 (title :Text, progress :Int32) -> ();
}

interface NotifyBlockTipCallback {
    call @0 (initialDownload :Bool, height :Int32, blockTime :Int64, verificationProgress :Float64) -> ();
}

interface NotifyHeaderTipCallback {
    call @0 (initialDownload :Bool, height :Int32, blockTime :Int64, verificationProgress :Float64) -> ();
}

interface BannedListChangedCallback {
    call @0 () -> ();
}

struct MapMsgCmdSize {
    entries @0 :List(Entry);
    struct Entry {
        key @0 :Text;
        value @1 :UInt64;
    }
}

struct NodeStats {
    nodeid @0 :Int32;
    services @1 :Int64;
    relayTxes @2 :Bool;
    lastSend @3 :Int64;
    lastRecv @4 :Int64;
    timeConnected @5 :Int64;
    timeOffset @6 :Int64;
    addrName @7 :Text;
    version @8 :Int32;
    cleanSubVer @9 :Text;
    inbound @10 :Bool;
    addnode @11 :Bool;
    startingHeight @12 :Int32;
    sendBytes @13 :UInt64;
    sendBytesPerMsgCmd @14 :MapMsgCmdSize;
    recvBytes @15 :UInt64;
    recvBytesPerMsgCmd @16 :MapMsgCmdSize;
    whitelisted @17 :Bool;
    pingTime @18 :Float64;
    pingWait @19 :Float64;
    minPing @20 :Float64;
    addrLocal @21 :Text;
    addr @22 :Data;
    stateStats @23 :NodeStateStats;
}

struct NodeStateStats {
    misbehavior @0 :Int32;
    syncHeight @1 :Int32;
    commonHeight @2 :Int32;
    heightInFlight @3 :List(Int32);
}
