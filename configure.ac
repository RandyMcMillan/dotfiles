# Process this file with autoconf to produce a configure script.
#m4_pattern_allow([AM_INIT_AUTOMAKE])
#AC_CONFIG_MACRO_DIR([m4])
AC_CONFIG_MACRO_DIRS([m4])
AC_CONFIG_SRCDIR([src/foo.c])
AC_CONFIG_FILES([GNUmakefile Makefile])

AC_PREREQ([2.59])
AC_INIT([dotfiles.randymcmillan.net], [0.1], [randy.lee.mcmillan@gmail.com])
AM_INIT_AUTOMAKE
#AM_MISSING_PROG(HELP2MAN, help2man)
AC_PATH_PROG(NOSTRIL, nostril, false // No nostril //)
AC_PATH_PROG(HELP2MAN, help2man, false // No help2man //)
AC_PATH_PROG(BREW, brew, false // No help2man //)
# Checks for programs.
AC_PROG_AWK
AC_PROG_YACC
AC_PROG_CC
AC_PROG_INSTALL
AC_PROG_LN_S
AC_PROG_MAKE_SET

AC_OUTPUT
