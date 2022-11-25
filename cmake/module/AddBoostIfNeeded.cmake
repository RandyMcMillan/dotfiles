# Copyright (c) 2023 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

function(add_boost_if_needed)
  #[=[
  TODO: Not all targets, which will be added in the future, require
        Boost. Therefore, a proper check will be appropriate here.

  Implementation notes:
  Although only Boost headers are used to build Bitcoin Core,
  we still leverage a standard CMake's approach to handle
  dependencies, i.e., the Boost::boost "library".
  A command target_link_libraries(target PRIVATE Boost::boost)
  will propagate Boost::boost usage requirements to the target.
  For Boost::boost such usage requirements is an include
  directory and other added INTERFACE properties.
  In CMake 3.15+ Boost::headers target can be used instead.
  ]=]

  if(CMAKE_HOST_SYSTEM_NAME STREQUAL "Darwin" AND BREW_COMMAND)
    execute_process(
      COMMAND ${BREW_COMMAND} --prefix boost
      OUTPUT_VARIABLE BOOST_ROOT
      ERROR_QUIET
      OUTPUT_STRIP_TRAILING_WHITESPACE
    )
  endif()

  set(Boost_NO_BOOST_CMAKE ON)
  find_package(Boost 1.64.0 REQUIRED)
  set_target_properties(Boost::boost PROPERTIES IMPORTED_GLOBAL TRUE)
  target_compile_definitions(Boost::boost INTERFACE
    $<$<OR:$<BOOL:${FUZZ}>,$<CONFIG:Debug>>:BOOST_MULTI_INDEX_ENABLE_SAFE_MODE>
  )

  mark_as_advanced(Boost_INCLUDE_DIR)
endfunction()
