AC_PREREQ(2.60)
AC_INIT([example],
	[1.0],
	[gabriel@lse.epita.fr],
	[example],
	[https://lse.epita.fr/])

AC_PROG_CC
AC_USE_SYSTEM_EXTENSIONS

#AX_COMPILER_FLAGS

AM_SILENT_RULES([yes])

#AX_PTHREAD(
#	   [PTHREAD_LIBS="-lpthread"],
#	   AC_MSG_ERROR([$PACKAGE requires pthreads]))

PKG_CHECK_MODULES([CURL], [libcurl])
#AX_CHECK_OPENSSL()

AC_CONFIG_HEADERS(config.h)
AC_CONFIG_FILES([GNUmakefile], [make submodules])

AC_OUTPUT
AC_MSG_RESULT([
	$PACKAGE $VERSION
	====================

	prefix:		${prefix}
	compiler:	${CC}
	cflags:		${CFLAGS}
	ldflags:	${LDFLAGS}
])
