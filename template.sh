#!/usr/bin/env bash
HOMEBREW_NO_INSTALL_CLEANUP=fale
export  HOMEBREW_NO_INSTALL_CLEANUP

function checkbrew() {
    if hash brew 2>/dev/null; then
        if ! hash $AWK 2>/dev/null; then
            brew install $AWK
        fi
        if ! hash git 2>/dev/null; then
            brew install git
        fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
