# Copyright (c) 2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

# We are able to build on Ubuntu Bionic.
# On the other hand, some useful features lack:
#  - 3.11: add_library() and add_executable() commands can now be called without any sources
#          and will not complain as long as sources are added later via the target_sources()
#          command.
#  - 3.11: The target_*() commands learned to set the INTERFACE properties on Imported Targets.
#  - 3.12: The add_compile_definitions() command was added to set preprocessor definitions
#          at directory level. This supersedes add_definitions().
#  - 3.12: If the CONFIGURE_DEPENDS flag is specified, CMake will add logic to the main
#          build system check target to rerun the flagged GLOB commands at build time.
#  - 3.12: Object libraries can be linked to with target_link_libraries().
#  - 3.12: A new $<TARGET_NAME_IF_EXISTS:...> generator expression has been added.
#  - 3.13: The target_link_options() command was created to specify link options for targets
#          and their dependents.
#  - 3.13: The target_link_libraries() command may now be called to modify targets created
#          outside the current directory.
#  - 3.14: The FindSQLite3 module was added to find the SQLite v3.x library.
#  - 3.15: A new imported target Boost::headers is now defined (same as Boost::boost).
cmake_minimum_required(VERSION 3.10)

project("Bitcoin Core"
  VERSION 23.0.0
  DESCRIPTION "Bitcoin client software"
  LANGUAGES CXX C ASM
)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

add_compile_options(-pipe -O2)
if(CMAKE_SYSTEM_NAME STREQUAL Linux)
  if(CMAKE_SYSTEM_PROCESSOR STREQUAL arm)
    add_compile_options(-Wno-psabi)
  endif()
  link_libraries(-Wl,-O2)
endif()
if(CMAKE_SYSTEM_NAME STREQUAL Darwin)
  add_definitions(-DMAC_OSX -DOBJC_OLD_DISPATCH_PROTOTYPES=0)
  link_libraries(-Wl,-headerpad_max_install_names)
endif()
