#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update
        # Upgrade any already-installed formulae.
        brew upgrade
        brew install autoconf automake berkeley-db4 libtool boost miniupnpc pkg-config python qt libevent qrencode
        brew install librsvg
        git clone https://github.com/randymcmillan/bitcoin ~/bitcoin
        cd ~/bitcoin && ./contrib/install_db4.sh .
        ./autogen.sh && ./configure && make deploy


    else
        $(pwd)/installbrew.sh
        #/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    fi
}

checkbrew

# Remove outdated versions from the cellar.
brew cleanup
