#!/bin/sh

set -e

srcdir=`dirname "$0"`
test -z "$srcdir" && srcdir=.

ORIGDIR=`pwd`
cd "$srcdir"

autoreconf --force --verbose --install
cd "$ORIGDIR"

if test -z "$NOCONFIGURE"; then
    "$srcdir"/configure "$@"
fi
