# Copyright (c) 2023 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

include(CheckCXXSourceCompiles)
include(CMakeCheckCompilerFlagCommonPatterns)

function(try_append_linker_flag flags_var flag)
  cmake_parse_arguments(PARSE_ARGV 2
    TRY_APPEND_LINKER_FLAG            # prefix
    ""                                # options
    "SOURCE;RESULT_VAR"               # one_value_keywords
    "IF_CHECK_PASSED;IF_CHECK_FAILED" # multi_value_keywords
  )

  string(MAKE_C_IDENTIFIER "${flag}" result)
  string(TOUPPER "${result}" result)
  set(result "LINKER_SUPPORTS_${result}")
  unset(${result})
  if(CMAKE_VERSION VERSION_LESS 3.14)
    set(CMAKE_REQUIRED_LIBRARIES "${flag}")
  else()
    set(CMAKE_REQUIRED_LINK_OPTIONS "${flag}")
  endif()

  if(TRY_APPEND_LINKER_FLAG_SOURCE)
    set(source "${TRY_APPEND_LINKER_FLAG_SOURCE}")
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

  check_compiler_flag_common_patterns(common_patterns)
  # This forces running a linker.
  set(CMAKE_TRY_COMPILE_TARGET_TYPE EXECUTABLE)
  check_cxx_source_compiles("${source}" ${result} ${common_patterns})

  foreach(v IN LISTS locale_vars)
    set(ENV{${v}} ${locale_vars_saved_${v}})
  endforeach()

  if(${result})
    if(DEFINED TRY_APPEND_LINKER_FLAG_IF_CHECK_PASSED)
      string(STRIP "${${flags_var}} ${TRY_APPEND_LINKER_FLAG_IF_CHECK_PASSED}" ${flags_var})
    else()
      string(STRIP "${${flags_var}} ${flag}" ${flags_var})
    endif()
  elseif(DEFINED TRY_APPEND_LINKER_FLAG_IF_CHECK_FAILED)
    string(STRIP "${${flags_var}} ${TRY_APPEND_LINKER_FLAG_IF_CHECK_FAILED}" ${flags_var})
  endif()

  set(${flags_var} "${${flags_var}}" PARENT_SCOPE)
  set(${TRY_APPEND_LINKER_FLAG_RESULT_VAR} "${${result}}" PARENT_SCOPE)
endfunction()
