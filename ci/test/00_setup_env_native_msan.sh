#!/usr/bin/env bash
#
# Copyright (c) 2020-2023 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

export LC_ALL=C.UTF-8

export CI_IMAGE_NAME_TAG="ubuntu:22.04"
LIBCXX_DIR="${BASE_SCRATCH_DIR}/msan/cxx_build/"
export MSAN_FLAGS="-fsanitize=memory -fsanitize-memory-track-origins=2 -fno-omit-frame-pointer -g -O1 -fno-optimize-sibling-calls"
LIBCXX_FLAGS="-nostdinc++ -nostdlib++ -isystem ${LIBCXX_DIR}include/c++/v1 -L${LIBCXX_DIR}lib -Wl,-rpath,${LIBCXX_DIR}lib -lc++ -lc++abi -lpthread -Wno-unused-command-line-argument"
export MSAN_AND_LIBCXX_FLAGS="${MSAN_FLAGS} ${LIBCXX_FLAGS}"

export CONTAINER_NAME="ci_native_msan"
export PACKAGES="cmake ninja-build"
# BDB generates false-positives and will be removed in future
export DEP_OPTS="NO_BDB=1 NO_QT=1 CC=clang CXX=clang++ CFLAGS='${MSAN_FLAGS}' CXXFLAGS='${MSAN_AND_LIBCXX_FLAGS}'"

# TODO: Reenable when it will be implementd in CMake.
# export GOAL="install"

export BITCOIN_CONFIG="-DSANITIZERS=memory -DHARDENING=OFF -DASM=OFF -DCMAKE_C_FLAGS='${MSAN_FLAGS}' -DCMAKE_CXX_FLAGS='${MSAN_AND_LIBCXX_FLAGS}'"
export USE_MEMORY_SANITIZER="true"
export RUN_FUNCTIONAL_TESTS="false"
export CCACHE_SIZE=250M
