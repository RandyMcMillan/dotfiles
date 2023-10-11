#!/usr/bin/env bash

install-karabiner-elements() {

    if hash brew 2>/dev/null; then
        brew cask install karabiner-elements
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
install-karabiner-elements

