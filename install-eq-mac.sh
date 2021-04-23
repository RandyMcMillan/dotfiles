#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        brew install --cask eqmac
    else
    #example - execute script with perl
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    checkbrew

    fi
}
checkbrew
