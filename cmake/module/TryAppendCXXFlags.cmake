# Copyright (c) 2023 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

include_guard(GLOBAL)
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
    TACXXF                            # prefix
    ""                                # options
    "SOURCE;RESULT_VAR"               # one_value_keywords
    "IF_CHECK_PASSED;IF_CHECK_FAILED" # multi_value_keywords
  )

  string(MAKE_C_IDENTIFIER "${flags}" result)
  string(TOUPPER "${result}" result)
  set(result "CXX_SUPPORTS_${result}")
  unset(${result})

  if(TACXXF_SOURCE)
    set(source "${TACXXF_SOURCE}")
    unset(${result} CACHE)
  else()
    set(source "int main() { return 0; }")
  endif()

  # This avoids running a linker.
  set(CMAKE_TRY_COMPILE_TARGET_TYPE STATIC_LIBRARY)
  set(CMAKE_REQUIRED_FLAGS "${flags} ${working_compiler_werror_flag}")
  check_cxx_source_compiles("${source}" ${result})

  if(${result})
    if(DEFINED TACXXF_IF_CHECK_PASSED)
      string(STRIP "${${flags_var}} ${TACXXF_IF_CHECK_PASSED}" ${flags_var})
    else()
      string(STRIP "${${flags_var}} ${flags}" ${flags_var})
    endif()
  elseif(DEFINED TACXXF_IF_CHECK_FAILED)
    string(STRIP "${${flags_var}} ${TACXXF_IF_CHECK_FAILED}" ${flags_var})
  endif()
  set(${flags_var} "${${flags_var}}" PARENT_SCOPE)
  set(${TACXXF_RESULT_VAR} "${${result}}" PARENT_SCOPE)
endfunction()

if(MSVC)
  set(warning_as_error_flag /WX)
else()
  set(warning_as_error_flag -Werror)
endif()
try_append_cxx_flags(working_compiler_werror_flag ${warning_as_error_flag})
unset(warning_as_error_flag)
