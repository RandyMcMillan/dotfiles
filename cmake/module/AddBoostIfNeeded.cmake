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
  dependencies, i.e., the Boost::headers "library".
  A command target_link_libraries(target PRIVATE Boost::headers)
  will propagate Boost::headers usage requirements to the target.
  For Boost::headers such usage requirements is an include
  directory and other added INTERFACE properties.
  ]=]

  set(Boost_NO_BOOST_CMAKE ON)
  find_package(Boost 1.64.0 REQUIRED)
  set_target_properties(Boost::boost PROPERTIES IMPORTED_GLOBAL TRUE)
  target_compile_definitions(Boost::boost INTERFACE
    # We don't use multi_index serialization.
    BOOST_MULTI_INDEX_DISABLE_SERIALIZATION
  )
  if(CMAKE_VERSION VERSION_LESS 3.15)
    add_library(Boost::headers ALIAS Boost::boost)
  endif()

  if(BUILD_TESTS)
    include(CheckCXXSourceCompiles)
    set(CMAKE_REQUIRED_INCLUDES ${Boost_INCLUDE_DIR})
    check_cxx_source_compiles("
      #define BOOST_TEST_MAIN
      #include <boost/test/included/unit_test.hpp>
      " HAVE_BOOST_INCLUDED_UNIT_TEST_H
    )
    if(NOT HAVE_BOOST_INCLUDED_UNIT_TEST_H)
      message(FATAL_ERROR "Building test_bitcoin executable requested but boost/test/included/unit_test.hpp header not available.")
    endif()

    check_cxx_source_compiles("
      #define BOOST_TEST_MAIN
      #include <boost/test/included/unit_test.hpp>
      #include <boost/test/unit_test.hpp>
      " HAVE_BOOST_UNIT_TEST_H
    )
    if(NOT HAVE_BOOST_UNIT_TEST_H)
      message(FATAL_ERROR "Building test_bitcoin executable requested but boost/test/unit_test.hpp header not available.")
    endif()
  endif()

  mark_as_advanced(Boost_INCLUDE_DIR)
endfunction()
