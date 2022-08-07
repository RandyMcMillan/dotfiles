# Copyright (c) 2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

add_library(bitcoinconsensus SHARED "")
target_sources(bitcoinconsensus
  PRIVATE
    bitcoinconsensus.cpp
    ../support/cleanse.cpp
)
target_compile_definitions(bitcoinconsensus
  PRIVATE
    BUILD_BITCOIN_INTERNAL
)
target_include_directories(bitcoinconsensus
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_SOURCE_DIR}/src>
)
target_link_libraries(bitcoinconsensus
  PRIVATE
    bitcoin_consensus
)
