# Process this file with autoconf to produce a configure script.

AC_PREREQ([2.69])

#ACLOCAL_AMFLAGS=-Im4
#SUBDIRS = po
AC_PROG_GETTEXT
AM_GNU_GETTEXT([external])
AC_PATH_PROG(GETTEXT, gettext, false // No gettext //)
AC_PATH_PROG(GETTEXTIZE, gettextize, false // No gettextize //)
AC_INIT([FULL-PACKAGE-NAME], [VERSION], [BUG-REPORT-ADDRESS])
#AC_INIT([mumble], [1.5])
m4_pattern_allow([AM_INIT_AUTOMAKE])
AC_CONFIG_MACRO_DIRS([m4])
AC_CONFIG_SRCDIR([src/foo.c])
AC_CONFIG_FILES([GNUmakefile po/Makefile.in])
#AM_MISSING_PROG(HELP2MAN, help2man)
AC_PATH_PROG(HELP2MAN, help2man, false // No help2man //)
AC_PATH_PROG(BREW, brew, false // No brew //)
AC_PATH_PROG(LEGIT, legit, false // No legit //)
AC_PATH_PROG(NOSTRIL, nostril, false // No nostril //)
# Checks for programs.
AC_PROG_AWK
AC_PROG_YACC
AC_PROG_CC
AC_PROG_INSTALL
AC_PROG_LN_S
AC_PROG_MAKE_SET

AC_OUTPUT
