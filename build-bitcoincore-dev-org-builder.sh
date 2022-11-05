#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        brew update
        brew upgrade
        #install brew libs
        brew install wget
        brew install curl
        brew install autoconf automake berkeley-db4 libtool boost miniupnpc pkg-config python qt libevent qrencode
        brew install librsvg codespell shellcheck
    else
        #example - execute script with perl
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    checkbrew
    sudo apt install linuxbrew-wrapper
    sudo apt-get install autoconf
    sudo apt-get install libdb4.8++-dev
    sudo apt-get -y install libboost libevent miniupnpc libdb4.8 qt libqrencode univalue libzmq3
    sudo apt-get install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
    sudo apt-get install libevent-dev libboost-system-dev libboost-filesystem-dev libboost-test-dev libboost-thread-dev
    sudo apt-get install libminiupnpc-dev
    sudo apt-get install libzmq3-dev
    sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools
    sudo apt-get install libqrencode-dev

    git clone https://github.com/bitcoincore-dev/org-builder ~/bitcoincore-dev-org-builder
    cd ~/gui && ./contrib/install_db4.sh .
    ./autogen.sh && ./configure --disable-wallet --disable-tests --disable-bench && make appbundle

elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew

    git clone https://github.com/bitcoincore-dev/org-builder ~/bitcoincore-dev-org-builder

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



