# Copyright (c) 2023 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

include_guard(GLOBAL)
include(CheckCXXSourceCompiles)

function(try_append_linker_flag flags_var flag)
  cmake_parse_arguments(PARSE_ARGV 2
    TALF                              # prefix
    ""                                # options
    "SOURCE;RESULT_VAR"               # one_value_keywords
    "IF_CHECK_PASSED;IF_CHECK_FAILED" # multi_value_keywords
  )

  string(MAKE_C_IDENTIFIER "${flag}" result)
  string(TOUPPER "${result}" result)
  set(result "LINKER_SUPPORTS_${result}")
  unset(${result})

  if(TALF_SOURCE)
    set(source "${TALF_SOURCE}")
    unset(${result} CACHE)
  else()
    set(source "int main() { return 0; }")
  endif()

  # This forces running a linker.
  set(CMAKE_TRY_COMPILE_TARGET_TYPE EXECUTABLE)
  set(${linker_flags_var} ${flag} ${working_linker_werror_flag})
  check_cxx_source_compiles("${source}" ${result})

  if(${result})
    if(DEFINED TALF_IF_CHECK_PASSED)
      string(STRIP "${${flags_var}} ${TALF_IF_CHECK_PASSED}" ${flags_var})
    else()
      string(STRIP "${${flags_var}} ${flag}" ${flags_var})
    endif()
  elseif(DEFINED TALF_IF_CHECK_FAILED)
    string(STRIP "${${flags_var}} ${TALF_IF_CHECK_FAILED}" ${flags_var})
  endif()

  set(${flags_var} "${${flags_var}}" PARENT_SCOPE)
  set(${TALF_RESULT_VAR} "${${result}}" PARENT_SCOPE)
endfunction()

if(CMAKE_VERSION VERSION_LESS 3.14)
  set(linker_flags_var CMAKE_REQUIRED_LIBRARIES)
else()
  set(linker_flags_var CMAKE_REQUIRED_LINK_OPTIONS)
endif()

if(MSVC)
  set(warning_as_error_flag /WX)
elseif(CMAKE_SYSTEM_NAME STREQUAL "Darwin")
  set(warning_as_error_flag -Wl,-fatal_warnings)
else()
  set(warning_as_error_flag -Wl,--fatal-warnings)
endif()
try_append_linker_flag(working_linker_werror_flag ${warning_as_error_flag})
unset(warning_as_error_flag)
