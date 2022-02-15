#!/usr/bin/env bash
HOMEBREW_NO_INSTALL_CLEANUP=fale
export  HOMEBREW_NO_INSTALL_CLEANUP
function checkbrew() {
if [ "$EUID" -ne "0" ]; then
    if hash brew 2>/dev/null; then
        export AWK=gawk
        if ! hash $AWK 2>/dev/null; then
        if hash awk 2>/dev/null; then
            brew unlink awk
        fi
            brew install $AWK
            brew link $AWK
        fi
        if ! hash git 2>/dev/null; then
            brew install git
        fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
else
    echo "home brew prevents being installed from root!!!\nTry\nmake adduser-git"
fi
}
