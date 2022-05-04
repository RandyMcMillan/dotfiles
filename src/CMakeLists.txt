# Copyright (c) 2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

add_library(bitcoin_crypto OBJECT)
target_sources(bitcoin_crypto
  PRIVATE
    crypto/aes.cpp
    crypto/chacha_poly_aead.cpp
    crypto/chacha20.cpp
    crypto/hkdf_sha256_32.cpp
    crypto/hmac_sha256.cpp
    crypto/hmac_sha512.cpp
    crypto/poly1305.cpp
    crypto/muhash.cpp
    crypto/ripemd160.cpp
    crypto/sha1.cpp
    crypto/sha256.cpp
    crypto/sha3.cpp
    crypto/sha512.cpp
    crypto/siphash.cpp
)
target_include_directories(bitcoin_crypto
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
)


# Home for common functionality shared by different executables and libraries.
# Similar to `bitcoin_common` library, but lower-level.
add_library(bitcoin_util STATIC)
target_sources(bitcoin_util
  PRIVATE
    support/lockedpool.cpp
    chainparamsbase.cpp
    clientversion.cpp
    compat/glibcxx_sanity.cpp
    fs.cpp
    interfaces/echo.cpp
    interfaces/handler.cpp
    interfaces/init.cpp
    logging.cpp
    random.cpp
    randomenv.cpp
    rpc/request.cpp
    support/cleanse.cpp
    sync.cpp
    threadinterrupt.cpp
    util/asmap.cpp
    util/bip32.cpp
    util/bytevectorhash.cpp
    util/check.cpp
    util/error.cpp
    util/fees.cpp
    util/getuniquepath.cpp
    util/hasher.cpp
    util/sock.cpp
    util/syserror.cpp
    util/system.cpp
    util/message.cpp
    util/moneystr.cpp
    util/rbf.cpp
    util/readwritefile.cpp
    util/settings.cpp
    util/thread.cpp
    util/threadnames.cpp
    util/serfloat.cpp
    util/spanparsing.cpp
    util/strencodings.cpp
    util/string.cpp
    util/syscall_sandbox.cpp
    util/time.cpp
    util/tokenpipe.cpp

    util/url.cpp
)
target_include_directories(bitcoin_util
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
)

check_cxx_source_compiles("
  #include <ctime>
  int main(int argc, char** argv)
  {
    gmtime_r((const time_t*)nullptr, (struct tm*)nullptr);
    return 0;
  }"
  HAVE_GMTIME_R
)

if(HAVE_GMTIME_R)
  target_compile_definitions(bitcoin_util PRIVATE HAVE_GMTIME_R)
else()
  check_cxx_source_compiles("
    #include <ctime>
    int main(int argc, char** argv)
    {
      gmtime_s((struct tm*)nullptr, (const time_t*)nullptr);
      return 0;
    }"
    HAVE_GMTIME_S
  )
  if(NOT HAVE_GMTIME_S)
    message(FATAL_ERROR "Both gmtime_r and gmtime_s are unavailable")
  endif()
endif()

target_link_libraries(bitcoin_util
  PRIVATE
    univalue
)


# Optimized C library for ECDSA signatures and secret/public key operations on curve secp256k1.
# See https://github.com/bitcoin-core/secp256k1
add_library(secp256k1 STATIC IMPORTED)

target_include_directories(secp256k1
  INTERFACE
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/secp256k1/include>
)

ExternalProject_Add(libsecp256k1
  PREFIX secp256k1
  SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/secp256k1
  BINARY_DIR secp256k1
  CONFIGURE_COMMAND cd ${CMAKE_CURRENT_SOURCE_DIR}/secp256k1 && ./autogen.sh && cd - && ${CMAKE_CURRENT_SOURCE_DIR}/secp256k1/configure --prefix=${CMAKE_CURRENT_BINARY_DIR}/secp256k1 --disable-shared --with-pic --enable-benchmark=no --enable-module-recovery --enable-module-schnorrsig
  BUILD_ALWAYS TRUE
)

add_dependencies(secp256k1 libsecp256k1)
set_target_properties(secp256k1 PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_BINARY_DIR}/secp256k1/lib/libsecp256k1.a
)


# Home for common functionality shared by different executables and libraries.
# Similar to `bitcoin_util` library, but higher-level.
add_library(bitcoin_common STATIC)
target_sources(bitcoin_common
  PRIVATE
    base58.cpp
    bech32.cpp
    chainparams.cpp
    coins.cpp
    common/bloom.cpp
    compressor.cpp
    core_read.cpp
    core_write.cpp
    deploymentinfo.cpp
    external_signer.cpp
    init/common.cpp
    key.cpp
    key_io.cpp
    merkleblock.cpp
    net_types.cpp
    netaddress.cpp
    netbase.cpp
    net_permissions.cpp
    outputtype.cpp
    policy/feerate.cpp
    policy/policy.cpp
    protocol.cpp
    psbt.cpp
    rpc/rawtransaction_util.cpp
    rpc/external_signer.cpp
    rpc/util.cpp
    scheduler.cpp
    script/descriptor.cpp
    script/miniscript.cpp
    script/sign.cpp
    script/signingprovider.cpp
    script/standard.cpp
    warnings.cpp
)
target_include_directories(bitcoin_common
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
)
target_link_libraries(bitcoin_common
  PRIVATE
    univalue
    secp256k1
)


# Stable, backwards-compatible consensus functionality used
# by `bitcoin_node` and `bitcoin_wallet` libraries and also exposed
# as a shared library.
add_library(bitcoin_consensus OBJECT)
target_sources(bitcoin_consensus
  PRIVATE
    arith_uint256.cpp
    consensus/merkle.cpp
    consensus/tx_check.cpp
    hash.cpp
    primitives/block.cpp
    primitives/transaction.cpp
    pubkey.cpp
    script/bitcoinconsensus.cpp
    script/interpreter.cpp
    script/script.cpp
    script/script_error.cpp
    uint256.cpp
    util/strencodings.cpp
)
target_include_directories(bitcoin_consensus
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
)
target_link_libraries(bitcoin_consensus
  PRIVATE
    secp256k1
)
set_target_properties(bitcoin_consensus PROPERTIES
  POSITION_INDEPENDENT_CODE ON
)


# Bitcoin Core RPC client
add_library(bitcoin_cli STATIC)
add_executable(bitcoin-cli)

set_target_properties(bitcoin-cli PROPERTIES
  POSITION_INDEPENDENT_CODE ON
)

target_include_directories(bitcoin_cli
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
)

target_sources(bitcoin_cli
  PRIVATE
    compat/stdin.cpp
    rpc/client.cpp
)

target_link_libraries(bitcoin_cli
  PRIVATE
    univalue
)

target_sources(bitcoin-cli
  PRIVATE
    bitcoin-cli.cpp
)

target_link_libraries(bitcoin-cli
  PRIVATE
    bitcoin_cli
    bitcoin_util
    bitcoin_crypto
    univalue
)

pkg_check_modules(LIBEVENT REQUIRED libevent>=2.1.8)
message(STATUS "  LDFLAGS: ${LIBEVENT_STATIC_LDFLAGS}")
target_link_libraries(bitcoin-cli PRIVATE ${LIBEVENT_STATIC_LDFLAGS})
if(WIN32)
  target_link_libraries(bitcoin-cli PRIVATE iphlpapi -static)
endif()


# P2P and RPC server functionality used by `bitcoind` and `bitcoin-qt` executables.
add_library(bitcoin_node STATIC)

target_include_directories(bitcoin_node
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
)

target_sources(bitcoin_node
  PRIVATE
    addrdb.cpp
    addrman.cpp
    banman.cpp
    blockencodings.cpp
    blockfilter.cpp
    chain.cpp
    consensus/tx_verify.cpp
    dbwrapper.cpp
    deploymentstatus.cpp
    flatfile.cpp
    httprpc.cpp
    httpserver.cpp
    i2p.cpp
    index/base.cpp
    index/blockfilterindex.cpp
    index/coinstatsindex.cpp
    index/txindex.cpp
    init.cpp
    mapport.cpp
    net.cpp
    netgroup.cpp
    net_processing.cpp
    node/blockstorage.cpp
    node/caches.cpp
    node/chainstate.cpp
    node/coin.cpp
    node/coinstats.cpp
    node/context.cpp
    node/interfaces.cpp
    node/miner.cpp
    node/minisketchwrapper.cpp
    node/psbt.cpp
    node/transaction.cpp
    node/ui_interface.cpp
    noui.cpp
    policy/fees.cpp
    policy/packages.cpp
    policy/rbf.cpp
    policy/settings.cpp
    pow.cpp
    rest.cpp
    rpc/blockchain.cpp
    rpc/fees.cpp
    rpc/mempool.cpp
    rpc/mining.cpp
    rpc/net.cpp
    rpc/node.cpp
    rpc/output_script.cpp
    rpc/rawtransaction.cpp
    rpc/server.cpp
    rpc/server_util.cpp
    rpc/signmessage.cpp
    rpc/txoutproof.cpp
    script/sigcache.cpp
    shutdown.cpp
    signet.cpp
    timedata.cpp
    torcontrol.cpp
    txdb.cpp
    txmempool.cpp
    txorphanage.cpp
    txrequest.cpp
    validation.cpp
    validationinterface.cpp
    versionbits.cpp

    dummywallet.cpp
)

target_link_libraries(bitcoin_node
  PRIVATE
    minisketch
    leveldb
    univalue
)


# Bitcoin Core bitcoind
add_executable(bitcoind)

set_target_properties(bitcoind PROPERTIES
  POSITION_INDEPENDENT_CODE ON
)

target_sources(bitcoind
  PRIVATE
    bitcoind.cpp
    init/bitcoind.cpp
)

target_link_libraries(bitcoind
  PRIVATE
    bitcoin_node
    bitcoin_consensus
    bitcoin_common
    bitcoin_util
    bitcoin_crypto
    ${LIBEVENT_STATIC_LDFLAGS}
)

if(WIN32)
  target_link_libraries(bitcoind PRIVATE iphlpapi -static)
else()
  pkg_check_modules(LIBEVENT_PTHREADS REQUIRED libevent_pthreads>=2.1.8)
  message(STATUS "  LDFLAGS: ${LIBEVENT_PTHREADS_STATIC_LDFLAGS}")
  target_link_libraries(bitcoind PRIVATE ${LIBEVENT_PTHREADS_STATIC_LDFLAGS})
endif()
