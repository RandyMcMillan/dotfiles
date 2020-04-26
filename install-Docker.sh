#!/usr/bin/env bash

install-docker() {

    if hash brew 2>/dev/null; then
        brew install docker
        brew cask install docker
        brew link --overwrite docker
        ls -l /usr/local/bin/docker*
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
install-docker
