#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        brew install --cask little-snitch
    else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    checkbrew
    fi
}
checkbrew
