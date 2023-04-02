# Copyright (c) 2023 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

include(CheckCXXSourceCompiles)

#[=[
Usage examples:

  try_append_cxx_flags(warn_cxx_flags "-Wformat -Wformat-security")


  try_append_cxx_flags(warn_cxx_flags "-Wsuggest-override"
    SOURCE "struct A { virtual void f(); }; struct B : A { void f() final; };"
  )


  try_append_cxx_flags(sanitizers_cxx_flags "-fsanitize=${SANITIZERS}" RESULT_VAR cxx_supports_sanitizers)
  if(NOT cxx_supports_sanitizers)
    message(FATAL_ERROR "Compiler did not accept requested flags.")
  endif()


  try_append_cxx_flags(warn_cxx_flags "-Wunused-parameter" IF_CHECK_PASSED "-Wno-unused-parameter")


  try_append_cxx_flags(error_cxx_flags "-Werror=return-type"
    IF_CHECK_FAILED "-Wno-error=return-type"
    SOURCE "#include <cassert>\nint f(){ assert(false); }"
  )

]=]
function(try_append_cxx_flags flags_var flags)
  cmake_parse_arguments(PARSE_ARGV 2
    TRY_APPEND_CXX_FLAGS              # prefix
    ""                                # options
    "SOURCE;RESULT_VAR"               # one_value_keywords
    "IF_CHECK_PASSED;IF_CHECK_FAILED" # multi_value_keywords
  )

  string(MAKE_C_IDENTIFIER "${flags}" result)
  string(TOUPPER "${result}" result)
  set(result "CXX_SUPPORTS_${result}")
  unset(${result})
  set(CMAKE_REQUIRED_FLAGS "${flags}")
  if(NOT MSVC)
    set(CMAKE_REQUIRED_FLAGS "${CMAKE_REQUIRED_FLAGS} -Werror")
  endif()

  if(TRY_APPEND_CXX_FLAGS_SOURCE)
    set(source "${TRY_APPEND_CXX_FLAGS_SOURCE}")
    unset(${result} CACHE)
  else()
    set(source "int main() { return 0; }")
  endif()

  # Normalize locale during test compilation.
  set(locale_vars LC_ALL LC_MESSAGES LANG)
  foreach(v IN LISTS locale_vars)
    set(locale_vars_saved_${v} "$ENV{${v}}")
    set(ENV{${v}} C)
  endforeach()

  # This avoids running a linker.
  set(CMAKE_TRY_COMPILE_TARGET_TYPE STATIC_LIBRARY)
  check_cxx_source_compiles("${source}" ${result})

  foreach(v IN LISTS locale_vars)
    set(ENV{${v}} ${locale_vars_saved_${v}})
  endforeach()

  if(${result})
    if(DEFINED TRY_APPEND_CXX_FLAGS_IF_CHECK_PASSED)
      string(STRIP "${${flags_var}} ${TRY_APPEND_CXX_FLAGS_IF_CHECK_PASSED}" ${flags_var})
    else()
      string(STRIP "${${flags_var}} ${flags}" ${flags_var})
    endif()
  elseif(DEFINED TRY_APPEND_CXX_FLAGS_IF_CHECK_FAILED)
    string(STRIP "${${flags_var}} ${TRY_APPEND_CXX_FLAGS_IF_CHECK_FAILED}" ${flags_var})
  endif()
  set(${flags_var} "${${flags_var}}" PARENT_SCOPE)
  set(${TRY_APPEND_CXX_FLAGS_RESULT_VAR} "${${result}}" PARENT_SCOPE)
endfunction()
