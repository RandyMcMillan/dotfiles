# Copyright (c) 2023 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

# Optional features and packages.

if(CCACHE)
  find_program(CCACHE_EXECUTABLE ccache)
  if(CCACHE_EXECUTABLE)
    set(CCACHE ON)
    if(MSVC)
      # See https://github.com/ccache/ccache/wiki/MS-Visual-Studio
      set(MSVC_CCACHE_WRAPPER_CONTENT "\"${CCACHE_EXECUTABLE}\" \"${CMAKE_CXX_COMPILER}\"")
      set(MSVC_CCACHE_WRAPPER_FILENAME wrapped-cl.bat)
      file(WRITE ${CMAKE_BINARY_DIR}/${MSVC_CCACHE_WRAPPER_FILENAME} "${MSVC_CCACHE_WRAPPER_CONTENT} %*")
      set(CMAKE_VS_GLOBALS
        "CLToolExe=${MSVC_CCACHE_WRAPPER_FILENAME}"
        "CLToolPath=${CMAKE_BINARY_DIR}"
        "TrackFileAccess=false"
        "UseMultiToolTask=true"
        "DebugInformationFormat=OldStyle"
      )
    else()
      list(APPEND CMAKE_C_COMPILER_LAUNCHER ${CCACHE_EXECUTABLE})
      list(APPEND CMAKE_CXX_COMPILER_LAUNCHER ${CCACHE_EXECUTABLE})
    endif()
  elseif(CCACHE STREQUAL "AUTO")
    set(CCACHE OFF)
  else()
    message(FATAL_ERROR "ccache requested, but not found.")
  endif()
  mark_as_advanced(CCACHE_EXECUTABLE)
endif()

if(WITH_NATPMP)
  find_package(NATPMP MODULE)
  if(NATPMP_FOUND)
    set(WITH_NATPMP ON)
  elseif(WITH_NATPMP STREQUAL "AUTO")
    message(WARNING "libnatpmp not found, disabling.\n"
                    "To skip libnatpmp check, use \"-DWITH_NATPMP=OFF\".\n")
    set(WITH_NATPMP OFF)
  else()
    message(FATAL_ERROR "libnatpmp requested, but not found.")
  endif()
endif()

if(WITH_MINIUPNPC)
  find_package(MiniUPnPc MODULE)
  if(MiniUPnPc_FOUND)
    set(WITH_MINIUPNPC ON)
  elseif(WITH_MINIUPNPC STREQUAL "AUTO")
    message(WARNING "libminiupnpc not found, disabling.\n"
                    "To skip libminiupnpc check, use \"-DWITH_MINIUPNPC=OFF\".\n")
    set(WITH_MINIUPNPC OFF)
  else()
    message(FATAL_ERROR "libminiupnpc requested, but not found.")
  endif()
endif()

if(WITH_ZMQ)
  if(MSVC)
    find_package(ZeroMQ CONFIG)
  else()
    # The ZeroMQ project has provided config files since v4.2.2.
    # TODO: Switch to find_package(ZeroMQ) at some point in the future.
    include(CrossPkgConfig)
    cross_pkg_check_modules(libzmq IMPORTED_TARGET libzmq>=4)
    if(libzmq_FOUND)
      set_property(TARGET PkgConfig::libzmq APPEND PROPERTY
        INTERFACE_COMPILE_DEFINITIONS $<$<PLATFORM_ID:Windows>:ZMQ_STATIC>
      )
      set_property(TARGET PkgConfig::libzmq APPEND PROPERTY
        INTERFACE_LINK_LIBRARIES $<$<PLATFORM_ID:Windows>:iphlpapi;ws2_32>
      )
    endif()
  endif()
  if(TARGET libzmq OR TARGET PkgConfig::libzmq)
    set(WITH_ZMQ ON)
  elseif(WITH_ZMQ STREQUAL "AUTO")
    message(WARNING "libzmq not found, disabling.\n"
                    "To skip libzmq check, use \"-DWITH_ZMQ=OFF\".\n")
    set(WITH_ZMQ OFF)
  else()
    message(FATAL_ERROR "libzmq requested, but not found.")
  endif()
endif()

include(CheckCXXSourceCompiles)
if(WITH_USDT)
  check_cxx_source_compiles("
    #include <sys/sdt.h>

    int main()
    {
      DTRACE_PROBE(context, event);
      int a, b, c, d, e, f, g;
      DTRACE_PROBE7(context, event, a, b, c, d, e, f, g);
    }
    " HAVE_USDT_H
  )
  if(HAVE_USDT_H)
    set(ENABLE_TRACING TRUE)
    set(WITH_USDT ON)
  elseif(WITH_USDT STREQUAL "AUTO")
    set(WITH_USDT OFF)
  else()
    message(FATAL_ERROR "sys/sdt.h requested, but not found.")
  endif()
endif()

if(ENABLE_WALLET)
  if(WITH_SQLITE)
    include(CrossPkgConfig)
    cross_pkg_check_modules(sqlite sqlite3>=3.7.17 IMPORTED_TARGET)
    if(sqlite_FOUND)
      set(WITH_SQLITE ON)
      set(USE_SQLITE ON)
    elseif(WITH_SQLITE STREQUAL "AUTO")
      set(WITH_SQLITE OFF)
    else()
      message(FATAL_ERROR "SQLite requested, but not found.")
    endif()
  endif()

  if(WITH_BDB)
    find_package(BerkeleyDB 4.8 MODULE)
    if(BerkeleyDB_FOUND)
      set(WITH_BDB ON)
      set(USE_BDB ON)
      if(NOT BerkeleyDB_VERSION VERSION_EQUAL 4.8)
        message(WARNING "Found Berkeley DB (BDB) other than 4.8.")
        if(WARN_INCOMPATIBLE_BDB)
          message(WARNING "BDB (legacy) wallets opened by this build would not be portable!\n"
                          "If this is intended, pass \"-DWARN_INCOMPATIBLE_BDB=OFF\".\n"
                          "Passing \"-DWITH_BDB=OFF\" will suppress this warning.\n")
        else()
          message(WARNING "BDB (legacy) wallets opened by this build will not be portable!")
        endif()
      endif()
    else()
      message(WARNING "Berkeley DB (BDB) required for legacy wallet support, but not found.\n"
                      "Passing \"-DWITH_BDB=OFF\" will suppress this warning.\n")
      set(WITH_BDB OFF)
    endif()
  endif()
else()
  set(WITH_SQLITE OFF)
  set(WITH_BDB OFF)
endif()

if(WITH_SECCOMP)
  check_cxx_source_compiles("
    #include <linux/seccomp.h>
    #if !defined(__x86_64__)
    #  error Syscall sandbox is an experimental feature currently available only under Linux x86-64.
    #endif
    int main(){}
    " HAVE_SECCOMP_H
  )
  if(HAVE_SECCOMP_H)
    set(USE_SYSCALL_SANDBOX TRUE)
    set(WITH_SECCOMP ON)
  elseif(WITH_SECCOMP STREQUAL "AUTO")
    set(WITH_SECCOMP OFF)
  else()
    message(FATAL_ERROR "linux/seccomp.h requested, but not found.")
  endif()
endif()

if(WITH_GUI AND WITH_QRENCODE)
  cross_pkg_check_modules(libqrencode libqrencode IMPORTED_TARGET)
  if(libqrencode_FOUND)
    set_target_properties(PkgConfig::libqrencode PROPERTIES
      INTERFACE_COMPILE_DEFINITIONS USE_QRCODE
    )
    set(WITH_QRENCODE ON)
  elseif(WITH_QRENCODE STREQUAL "AUTO")
    set(WITH_QRENCODE OFF)
  else()
    message(FATAL_ERROR "libqrencode requested, but not found.")
  endif()
endif()

if(MULTIPROCESS)
  cross_pkg_check_modules(libmultiprocess libmultiprocess IMPORTED_TARGET)
  if(libmultiprocess_FOUND)
    set(MULTIPROCESS ON)
    set(MPGEN_PREFIX "${libmultiprocess_PREFIX}" CACHE PATH "libmultiprocess codegen tool prefix.")
  elseif(MULTIPROCESS STREQUAL "AUTO")
    set(MULTIPROCESS OFF)
  else()
    message(FATAL_ERROR "\"-DMULTIPROCESS=ON\" specified, but libmultiprocess library was not found.")
  endif()
endif()

if(WITH_EXTERNAL_SIGNER)
  if(TARGET Boost::boost AND TARGET Threads::Threads)
    set(CMAKE_REQUIRED_LIBRARIES Boost::boost Threads::Threads)
  endif()

  # Boost 1.78 and 1.79 require the following workaround.
  # See: https://github.com/boostorg/process/issues/235
  set(CMAKE_REQUIRED_FLAGS "-Wno-error=narrowing")

  check_cxx_source_compiles("
    #define BOOST_PROCESS_USE_STD_FS
    #include <boost/process.hpp>

    int main()
    {
      namespace bp = boost::process;
      bp::opstream stdin_stream;
      bp::ipstream stdout_stream;
      bp::child c(\"dummy\", bp::std_out > stdout_stream, bp::std_err > stdout_stream, bp::std_in < stdin_stream);
      stdin_stream << std::string{\"test\"} << std::endl;
      if (c.running()) c.terminate();
      c.wait();
      c.exit_code();
    }
    " HAVE_BOOST_PROCESS_H
  )

  if(HAVE_BOOST_PROCESS_H)
    set(ENABLE_EXTERNAL_SIGNER TRUE)
    set(BOOST_PROCESS_USE_STD_FS TRUE)
    set(WITH_EXTERNAL_SIGNER ON)
  elseif(WITH_EXTERNAL_SIGNER STREQUAL "AUTO")
    set(WITH_EXTERNAL_SIGNER OFF)
  else()
    message(FATAL_ERROR "External signer support requested, but is not supported by this Boost.Process version.")
  endif()
  set(CMAKE_REQUIRED_FLAGS)
  set(CMAKE_REQUIRED_LIBRARIES)
endif()
