# Process this file with autoconf to produce a configure script.

AC_PREREQ([2.69])
AC_INIT([FULL-PACKAGE-NAME], [VERSION], [BUG-REPORT-ADDRESS])
#AC_INIT([mumble], [1.5])
m4_pattern_allow([AM_INIT_AUTOMAKE])
AC_CONFIG_MACRO_DIRS([m4])
AC_CONFIG_SRCDIR([src/foo.c])
AC_CONFIG_FILES([GNUmakefile])
#AM_MISSING_PROG(HELP2MAN, help2man)
AC_PATH_PROG(HELP2MAN, help2man, false // No help2man //)
# Checks for programs.
AC_PROG_AWK
AC_PROG_YACC
AC_PROG_CC
AC_PROG_INSTALL
AC_PROG_LN_S
AC_PROG_MAKE_SET

AC_OUTPUT
