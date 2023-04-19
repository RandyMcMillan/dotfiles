#!/usr/bin/env bash
#
# Copyright (c) 2018-2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

export LC_ALL=C.UTF-8

BITCOIN_CONFIG_ALL=" -DCMAKE_INSTALL_PREFIX=$BASE_OUTDIR"
if [ -z "$NO_DEPENDS" ]; then
  BITCOIN_CONFIG_ALL="${BITCOIN_CONFIG_ALL} -DCMAKE_TOOLCHAIN_FILE=$DEPENDS_DIR/$HOST/share/toolchain.cmake"
fi
if [ -z "$NO_WERROR" ]; then
  BITCOIN_CONFIG_ALL="${BITCOIN_CONFIG_ALL} -DWERROR=ON"
fi

CI_EXEC "ccache --zero-stats --max-size=$CCACHE_SIZE"
PRINT_CCACHE_STATISTICS="ccache --version | head -n 1 && ccache --show-stats"

CI_EXEC mkdir -p "${BASE_BUILD_DIR}"
export P_CI_DIR="${BASE_BUILD_DIR}"

if [ -n "$ANDROID_TOOLS_URL" ]; then
  CI_EXEC cmake "$BITCOIN_CONFIG_ALL" "$BITCOIN_CONFIG" "${BASE_ROOT_DIR}" || ( (CI_EXEC cat CMakeFiles/CMakeOutput.log CMakeFiles/CMakeError.log) && false)
  CI_EXEC make "$MAKEJOBS" "$GOAL" || ( echo "Build failure. Verbose build follows." && CI_EXEC make "$GOAL" V=1 ; false )
  CI_EXEC make "$MAKEJOBS" apk_package || ( echo "Build failure. Verbose build follows." && CI_EXEC make apk_package V=1 ; false )
  CI_EXEC "${PRINT_CCACHE_STATISTICS}"
  exit 0
fi

BITCOIN_CONFIG_ALL="${BITCOIN_CONFIG_ALL} -DWITH_EXTERNAL_SIGNER=ON"

if [[ "${RUN_TIDY}" == "true" ]]; then
  BITCOIN_CONFIG_ALL="${BITCOIN_CONFIG_ALL} -DCMAKE_EXPORT_COMPILE_COMMANDS=ON"
fi

CI_EXEC cmake "$BITCOIN_CONFIG_ALL" "$BITCOIN_CONFIG" "${BASE_ROOT_DIR}" || ( (CI_EXEC cat CMakeFiles/CMakeOutput.log CMakeFiles/CMakeError.log) && false)

set -o errtrace
trap 'CI_EXEC "cat ${BASE_SCRATCH_DIR}/sanitizer-output/* 2> /dev/null"' ERR

if [[ ${USE_MEMORY_SANITIZER} == "true" ]]; then
  # MemorySanitizer (MSAN) does not support tracking memory initialization done by
  # using the Linux getrandom syscall. Avoid using getrandom by undefining
  # HAVE_SYS_GETRANDOM. See https://github.com/google/sanitizers/issues/852 for
  # details.
  CI_EXEC 'grep -v HAVE_SYS_GETRANDOM src/config/bitcoin-config.h > src/config/bitcoin-config.h.tmp && mv src/config/bitcoin-config.h.tmp src/config/bitcoin-config.h'
fi

CI_EXEC make "$MAKEJOBS" all "$GOAL" || ( echo "Build failure. Verbose build follows." && CI_EXEC make all "$GOAL" V=1 ; false )

CI_EXEC "${PRINT_CCACHE_STATISTICS}"
CI_EXEC du -sh "${DEPENDS_DIR}"/*/
CI_EXEC du -sh "${PREVIOUS_RELEASES_DIR}"
