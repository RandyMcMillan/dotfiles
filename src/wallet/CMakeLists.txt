# Copyright (c) 2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

# Wallet functionality used by bitcoind and bitcoin-wallet executables.
add_library(bitcoin_wallet STATIC EXCLUDE_FROM_ALL
  coincontrol.cpp
  coinselection.cpp
  context.cpp
  crypter.cpp
  db.cpp
  dump.cpp
  external_signer_scriptpubkeyman.cpp
  feebumper.cpp
  fees.cpp
  interfaces.cpp
  load.cpp
  receive.cpp
  rpc/addresses.cpp
  rpc/backup.cpp
  rpc/coins.cpp
  rpc/encrypt.cpp
  rpc/spend.cpp
  rpc/signmessage.cpp
  rpc/transactions.cpp
  rpc/util.cpp
  rpc/wallet.cpp
  scriptpubkeyman.cpp
  spend.cpp
  transaction.cpp
  wallet.cpp
  walletdb.cpp
  walletutil.cpp
)
target_include_directories(bitcoin_wallet
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_SOURCE_DIR}/src>
)
target_link_libraries(bitcoin_wallet
  INTERFACE
    bitcoin_common
    bitcoin_crypto
  PRIVATE
    univalue
    Boost::boost
)

if(NOT TARGET PkgConfig::sqlite AND NOT TARGET BerkeleyDB::BerkeleyDB)
  message(FATAL_ERROR "Wallet functionality requested but no BDB or SQLite support available.")
endif()
if(TARGET PkgConfig::sqlite)
  target_sources(bitcoin_wallet PRIVATE sqlite.cpp)
  target_link_libraries(bitcoin_wallet PRIVATE PkgConfig::sqlite)
endif()
if(TARGET BerkeleyDB::BerkeleyDB)
  target_sources(bitcoin_wallet PRIVATE bdb.cpp salvage.cpp)
  target_link_libraries(bitcoin_wallet PRIVATE BerkeleyDB::BerkeleyDB)
endif()
