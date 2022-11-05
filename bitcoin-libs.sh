#!/usr/bin/env bash

function install-bitcoin-libs() {
if [[ "$OSTYPE" == "darwin"* ]]; then
 install-bitcoin-libs-macos
fi
if [[ "$OSTYPE" == "linux-gnu" ]]; then
 install-bitcoin-libs-linux
fi
}
function install-bitcoin-libs-macos() {
if hash brew 2>/dev/null; then
    export HOMEBREW_NO_INSTALL_CLEANUP=false
    export  HOMEBREW_NO_ENV_HINTS=false
    brew update
    brew upgrade
    #install brew libs
    brew install wget
    brew install curl
    brew uninstall --ignore-dependencies qt
    brew install m4 perl autoconf automake berkeley-db@4 libtool boost miniupnpc pkg-config python@3 qt@5 libevent qrencode
    brew install librsvg bison
    brew install codespell shellcheck
    brew install afl-fuzz
    brew install --build-from-source afl-fuzz
    brew install --cask qt-creator
    # brew uninstall --cask --force suspicious-package
    brew install --cask --force suspicious-package
    # /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/bitcoin/bitcoin/contrib/contrib/install_db4.sh)" .
else
    #/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    checkbrew
fi
}

function install-bitcoin-libs-linux() {

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Try install-bitcoin-libs-macos"
fi
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    sudo apt-get install autoconf
    sudo apt-get install libdb4.8++-dev
    sudo apt-get -y install libboost libevent miniupnpc libdb4.8 qt libqrencode univalue libzmq3
    sudo apt-get install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
    sudo apt-get install libevent-dev libboost-system-dev libboost-filesystem-dev libboost-test-dev libboost-thread-dev
    sudo apt-get install libminiupnpc-dev
    sudo apt-get install libzmq3-dev
    sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools
    sudo apt-get install libqrencode-dev
fi
}

# elif [[ "$OSTYPE" == "cygwin" ]]; then
#     echo TODO add support for $OSTYPE
# elif [[ "$OSTYPE" == "msys" ]]; then
#     echo TODO add support for $OSTYPE
# elif [[ "$OSTYPE" == "win32" ]]; then
#     echo TODO add support for $OSTYPE
# elif [[ "$OSTYPE" == "freebsd"* ]]; then
#     echo TODO add support for $OSTYPE
# else
#     echo TODO add support for $OSTYPE
# fi



