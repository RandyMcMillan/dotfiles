#!/usr/bin/env bash
#
# Copyright (c) 2020-2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

export LC_ALL=C.UTF-8

export HOST=i686-pc-linux-gnu
export CONTAINER_NAME=ci_i686_multiprocess
export CI_IMAGE_NAME_TAG=ubuntu:20.04
export PACKAGES="cmake llvm clang g++-multilib"
export DEP_OPTS="DEBUG=1 MULTIPROCESS=1"

# TODO: Reenable when it will be implementd in CMake.
# export GOAL="install"

export CXXFLAGS="-DBOOST_MULTI_INDEX_ENABLE_SAFE_MODE"
export BITCOIN_CONFIG="-DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER='clang;-m32' -DCMAKE_CXX_COMPILER='clang++;-m32' \
-DCMAKE_EXE_LINKER_FLAGS='--rtlib=compiler-rt -lgcc_s -latomic'"

# TODO: Reenable when it will be implementd in CMake.
# export TEST_RUNNER_ENV="BITCOIND=bitcoin-node"
