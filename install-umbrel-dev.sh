#!/usr/bin/env bash
#
checkbrew() {

    if hash brew 2>/dev/null; then
        brew update
        brew upgrade
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    checkbrew
elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew
    brew install lukechilds/tap/umbrel-dev
    git clone https://github.com/getumbrel/umbrel-dev.git ~/.umbrel-dev
    export PATH="$PATH:$HOME/.umbrel-dev/bin"
    brew install --cask virtualbox vagrant
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

