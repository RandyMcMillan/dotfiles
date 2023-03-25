#!/usr/bin/env bash
#
checkbrew() {

    if hash brew 2>/dev/null; then
        if hash ruby-install 2>/dev/null; then
            brew install ruby-install
        fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew
#    ruby-install --system ruby 2.5.8
elif [[ "$OSTYPE" == "cygwin" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "msys" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "win32" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "freebsd"* ]]; then
    echo TODO add support for $OSTYPE
else
    echo TODO add support for $OSTYPE
fi

