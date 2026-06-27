#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        if !hash sassc 2>/dev/null; then
        brew install sassc
        fi
        #REF: https://github.com/sass/sassc
    else

    #example - execute script with perl
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    checkbrew

    fi
}

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew
elif [[ "$OSTYPE" == "win32" ]]; then
    echo TODO add support for $OSTYPE
else
    echo TODO add support for $OSTYPE
fi
