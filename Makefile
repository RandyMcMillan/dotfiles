EXTRA_DIST = autogen.sh
ACLOCAL_AMFLAGS = -I m4 ${ACLOCAL_FLAGS}
AM_MAKEFLAGS = --no-print-directory

AM_CPPFLAGS = \
	      -include $(top_builddir)/config.h \
	      -I${top_srcdir}/src

AM_CFLAGS = $(WARN_CFLAGS) $(PTHREAD_FLAGS) $(OPENSSL_INCLUDES) $(CURL_FLAGS)
AM_LDFLAGS = $(WARN_LDFLAGS)

bin_PROGRAMS = example

example_SOURCES = \
		  src/example.c \
		  src/thread.c \
		  src/thread.h

example_LDADD = $(PTHREAD_LIBS) $(OPENSSL_LDFLAGS) $(OPENSSL_LIBS) $(CURL_LIBS)

TESTS = \
	tests/test-args \
	test-example

EXTRA_DIST += tests/test-args

check_PROGRAMS = test-example

test_example_SOURCES = tests/test-example.c
