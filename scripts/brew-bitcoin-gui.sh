#!/usr/bin/env bash

build-bitcoin-gui() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update
        # Upgrade any already-installed formulae.
        brew upgrade
        brew install autoconf automake berkeley-db4 libtool boost miniupnpc pkg-config python qt libevent qrencode librsvg
        git clone https://github.com/randymcmillan/bitcoin $HOME
        cd $HOME/bitcoin && ./contrib/install_db4.sh .
        ./autogen.sh
        export BDB_PREFIX='$HOME/bitcoin/db4'
        ./configure
        make

    elif hash apt 2>/dev/null; then
        #debian apt
        sudo apt update
        sudo apt -y install wget curl libtool autoconf autoconf automake berkeley-db4 libtool boost miniupnpc pkg-config python qt libevent qrencode librsvg pkg-config
    elif hash apk 2>/dev/null; then
        echo "TODO: add alpine support"
    else
        false
}

build-bitcoin-gui
#!/usr/bin/env bash


if [[ "$OSTYPE" == "linux-gnu" ]]; then

if hash apt 2>/dev/null; then
    sudo apt update
    sudo apt -y install wget curl libtool autoconf autoconf automake berkeley-db4 libtool boost miniupnpc pkg-config python qt libevent qrencode librsvg pkg-config
    #sudo apt install linuxbrew-wrapper
    #brew-bitcoin-gui
fi

elif [[ "$OSTYPE" == "darwin"* ]]; then
    if hash brew 2>/dev/null; then
    brew install autoconf automake berkeley-db4 libtool boost miniupnpc pkg-config python qt libevent qrencode librsvg
    else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    brew install autoconf automake berkeley-db4 libtool boost miniupnpc pkg-config python qt libevent qrencode librsvg
    build-bitcoin-gui
    fi
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

