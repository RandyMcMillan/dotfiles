# Copyright (c) 2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

# Optional features and packages.

set(USE_CCACHE "auto" CACHE STRING "Use ccache for building ([auto], yes, no). \"auto\" means \"yes\" if ccache is found")

set(WITH_SQLITE "auto" CACHE STRING "Enable SQLite wallet support ([auto], yes, no). \"auto\" means \"yes\" if libsqlite3 is found")
set(WITH_BDB "auto" CACHE STRING "Enable Berkeley DB (BDB) wallet support ([auto], yes, no). \"auto\" means \"yes\" if libdb_cxx is found")
option(ALLOW_INCOMPATIBLE_BDB "Allow using a Berkeley DB (BDB) version other than 4.8" OFF)

set(WITH_NATPMP "auto" CACHE STRING "Enable NAT-PMP ([auto], yes, no). \"auto\" means \"yes\" if libnatpmp is found")
option(ENABLE_NATPMP_DEFAULT "If NAT-PMP is enabled, turn it on at startup" OFF)

set(WITH_MINIUPNPC "auto" CACHE STRING "Enable UPNP ([auto], yes, no). \"auto\" means \"yes\" if libminiupnpc is found")
option(ENABLE_UPNP_DEFAULT "If UPNP is enabled, turn it on at startup" OFF)

set(WITH_ZMQ "auto" CACHE STRING "Enable ZMQ notifications ([auto], yes, no). \"auto\" means \"yes\" if libzmq is found")

set(WITH_USDT "auto" CACHE STRING "Enable tracepoints for Userspace, Statically Defined Tracing ([auto], yes, no). \"auto\" means \"yes\" if sys/sdt.h is found")

set(OPTION_VALUES auto yes no)
foreach(option USE_CCACHE WITH_SQLITE WITH_BDB WITH_NATPMP WITH_MINIUPNPC WITH_ZMQ WITH_USDT)
  if(NOT ${option} IN_LIST OPTION_VALUES)
    message(FATAL_ERROR "${option} value is \"${${option}}\", but must be one of \"auto\", \"yes\" or \"no\".")
  endif()
endforeach()

if(NOT USE_CCACHE STREQUAL no)
  find_program(CCACHE ccache)
  if(CCACHE)
    set(CMAKE_CXX_COMPILER_LAUNCHER ${CCACHE})
  elseif(USE_CCACHE STREQUAL yes)
    message(FATAL_ERROR "ccache requested, but not found.")
  endif()
endif()

include(FindPkgConfig)
if(ENABLE_WALLET)
  set(WITH_WALLET no)

  if(NOT WITH_SQLITE STREQUAL no)
    pkg_check_modules(sqlite sqlite3>=3.7.17 IMPORTED_TARGET)
    if(sqlite_FOUND)
      set(WITH_WALLET yes)
      set(WITH_SQLITE yes)
      set(USE_SQLITE ON)
    else()
      set(WITH_SQLITE no)
      if(WITH_SQLITE STREQUAL yes)
        message(FATAL_ERROR "SQLite requested, but not found.")
      endif()
    endif()
  endif()

  if(NOT WITH_BDB STREQUAL no)
    find_package(BerkeleyDB 4.8)
    if(BerkeleyDB_FOUND)
      set(WITH_WALLET yes)
      set(WITH_BDB yes)
      set(USE_BDB ON)
      if(NOT BerkeleyDB_VERSION VERSION_EQUAL 4.8)
        message(WARNING "Found Berkeley DB (BDB) other than 4.8.")
        if(ALLOW_INCOMPATIBLE_BDB)
          message(WARNING "BDB (legacy) wallets opened by this build will not be portable!")
        else()
          message(WARNING "BDB (legacy) wallets opened by this build would not be portable!\n"
                          "If this is intended, pass \"-DALLOW_INCOMPATIBLE_BDB=ON\".\n"
                          "Passing \"-DWITH_BDB=no\" will suppress this warning.\n")
        endif()
      endif()
    else()
      set(WITH_BDB no)
      message(WARNING "Berkeley DB (BDB) required for legacy wallet support, but not found.\n"
                      "Passing \"-DWITH_BDB=no\" will suppress this warning.\n")
    endif()
  endif()
endif()

if(NOT WITH_NATPMP STREQUAL no)
  find_package(NATPMP)
  if(NATPMP_FOUND)
    set(WITH_NATPMP yes)
  else()
    set(WITH_NATPMP no)
    if(WITH_NATPMP STREQUAL yes)
      message(FATAL_ERROR "libnatpmp requested, but not found.")
    else()
      message(WARNING "libnatpmp not found, disabling.\n"
                      "To skip libnatpmp check, use \"-DWITH_NATPMP=no\".\n")
    endif()
  endif()
endif()

if(NOT WITH_MINIUPNPC STREQUAL no)
  find_package(MiniUPnPc)
  if(MiniUPnPc_FOUND)
    set(WITH_MINIUPNPC yes)
  else()
    set(WITH_MINIUPNPC no)
    if(WITH_MINIUPNPC STREQUAL yes)
      message(FATAL_ERROR "libminiupnpc requested, but not found.")
    else()
      message(WARNING "libminiupnpc not found, disabling.\n"
                      "To skip libminiupnpc check, use \"-DWITH_MINIUPNPC=no\".\n")
    endif()
  endif()
endif()

if(NOT WITH_ZMQ STREQUAL no)
  pkg_check_modules(libzmq libzmq>=4 IMPORTED_TARGET)
  if(libzmq_FOUND)
    set(WITH_ZMQ yes)
    set_property(TARGET PkgConfig::libzmq APPEND PROPERTY
      INTERFACE_COMPILE_DEFINITIONS $<$<PLATFORM_ID:Windows>:ZMQ_STATIC>
    )
  else()
    set(WITH_ZMQ no)
    if(WITH_ZMQ STREQUAL yes)
      message(FATAL_ERROR "libzmq requested, but not found.")
    else()
      message(WARNING "libzmq not found, disabling.\n"
                      "To skip libzmq check, use \"-DWITH_ZMQ=no\".\n")
    endif()
  endif()
endif()

include(CheckCXXSourceCompiles)
if(NOT WITH_USDT STREQUAL no)
  check_cxx_source_compiles("
  #include <sys/sdt.h>

  int main()
  {
    DTRACE_PROBE(\"context\", \"event\");
  }
  " HAVE_USDT_H)
  if(HAVE_USDT_H)
    set(WITH_USDT yes)
    set(ENABLE_TRACING TRUE)
  else()
    set(WITH_USDT no)
    if(WITH_USDT STREQUAL yes)
      message(FATAL_ERROR "sys/sdt.h requested, but not found.")
    endif()
  endif()
endif()
