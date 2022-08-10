# Copyright (c) 2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

set(CRC32C_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(CRC32C_BUILD_BENCHMARKS OFF CACHE BOOL "" FORCE)
set(CRC32C_USE_GLOG OFF CACHE BOOL "" FORCE)
set(CRC32C_INSTALL OFF CACHE BOOL "" FORCE)
set(CMAKE_POLICY_DEFAULT_CMP0063 NEW)
mark_as_advanced(
  CRC32C_BUILD_TESTS
  CRC32C_BUILD_BENCHMARKS
  CRC32C_USE_GLOG
  CRC32C_INSTALL
)
add_subdirectory(crc32c)
set_property(
  TARGET crc32c_arm64 crc32c_sse42
  APPEND
  PROPERTY COMPILE_DEFINITIONS CRC32C_HAVE_CONFIG_H
)

set(LEVELDB_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(LEVELDB_BUILD_BENCHMARKS OFF CACHE BOOL "" FORCE)
set(LEVELDB_INSTALL OFF CACHE BOOL "" FORCE)
set(HAVE_CRC32C ON CACHE BOOL "" FORCE)
set(HAVE_SNAPPY OFF CACHE BOOL "" FORCE)
set(HAVE_TCMALLOC OFF CACHE BOOL "" FORCE)
# Disabling TSA warnings because leveldb simultaneously
# enables -Werror as a usage requirement.
set(HAVE_CLANG_THREAD_SAFETY OFF CACHE BOOL "" FORCE)
mark_as_advanced(
  LEVELDB_BUILD_TESTS
  LEVELDB_BUILD_BENCHMARKS
  LEVELDB_INSTALL
  HAVE_CRC32C
  HAVE_SNAPPY
  HAVE_TCMALLOC
  HAVE_CLANG_THREAD_SAFETY
)
add_subdirectory(leveldb)
# RTTI has been forcibly disabled in CMake configuration since leveldb v1.23.
# Commit: 69061b464ab1da287da9b7ffec1ed911b754403b
# Using leveldb::Logger as a base class to derive CBitcoinLevelDBLogger
# requires RTTI been enabled.
target_compile_options(leveldb
  PRIVATE
    $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-frtti>
)
set_target_properties(leveldbutil PROPERTIES
  EXCLUDE_FROM_ALL TRUE
)

configure_file(../cmake/bitcoin-config.h.in config/bitcoin-config.h @ONLY)
include_directories(${CMAKE_BINARY_DIR}/src)
add_definitions(-DHAVE_CONFIG_H)

add_subdirectory(crypto)
add_subdirectory(univalue)
add_subdirectory(util)


# Home for common functionality shared by different executables and libraries.
# Similar to `bitcoin_util` library, but higher-level.
add_library(bitcoin_common STATIC EXCLUDE_FROM_ALL "")
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


# Stable, backwards-compatible consensus functionality
# also exposed as a shared library.
add_library(bitcoin_consensus STATIC EXCLUDE_FROM_ALL "")
target_sources(bitcoin_consensus
  PRIVATE
    arith_uint256.cpp
    consensus/merkle.cpp
    consensus/tx_check.cpp
    hash.cpp
    primitives/block.cpp
    primitives/transaction.cpp
    pubkey.cpp
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
    bitcoin_crypto
    secp256k1
)


# P2P and RPC server functionality used by `bitcoind` and `bitcoin-qt` executables.
add_library(bitcoin_node STATIC EXCLUDE_FROM_ALL "")
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
    kernel/chain.cpp
    kernel/checks.cpp
    kernel/coinstats.cpp
    kernel/context.cpp
    kernel/mempool_persist.cpp
    mapport.cpp
    net.cpp
    netgroup.cpp
    net_processing.cpp
    node/blockstorage.cpp
    node/caches.cpp
    node/chainstate.cpp
    node/coin.cpp
    node/connection_types.cpp
    node/context.cpp
    node/eviction.cpp
    node/interface_ui.cpp
    node/interfaces.cpp
    node/mempool_args.cpp
    node/mempool_persist_args.cpp
    node/miner.cpp
    node/minisketchwrapper.cpp
    node/psbt.cpp
    node/transaction.cpp
    node/validation_cache_args.cpp
    noui.cpp
    policy/fees.cpp
    policy/fees_args.cpp
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
target_include_directories(bitcoin_node
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
)
target_link_libraries(bitcoin_node
  PRIVATE
    minisketch
    leveldb
    univalue
    Boost::boost
    $<$<NOT:$<PLATFORM_ID:Windows>>:PkgConfig::libevent_pthreads>
)
