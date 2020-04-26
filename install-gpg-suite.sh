#!/usr/bin/env bash

install-gpg-suite() {

    if hash brew 2>/dev/null; then

        brew cask install gpg-suite

    else

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        install-gpg-suite

    fi
}
install-gpg-suite
