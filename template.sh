#!/usr/bin/env bash
HOMEBREW_NO_INSTALL_CLEANUP=fale
export  HOMEBREW_NO_INSTALL_CLEANUP


function checkbrew() {
if [ "$EUID" -ne "0" ]; then
    if hash brew 2>/dev/null; then
        printf "brew installed!!"
        printf "\ntry\ninstall <lib name>"
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
    printf "home brew prevents being installed from root!!!\nTry\nmake adduser-git"
fi
if [[ "$OSTYPE" == "linux"* ]]; then
if [ "$EUID" -ne "0" ]; then
    SUDO=sudo
fi
    #CHECK APT
    if [[ "$OSTYPE" == "linux-gnu" ]]; then
        PACKAGE_MANAGER=apt
        export PACKAGE_MANAGER
        INSTALL=install
        export INSTALL
        AWK=gawk
        export AWK
        if hash apt 2>/dev/null; then
            $SUDO $PACKAGE_MANAGER $INSTALL $AWK clang-tools
        fi
    fi
    printf 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/git/.bash_profile
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo
fi
}

for ((i=1;i<=$#;i++));
do


if [[ ${!i} = info ]]; then
    ((i++))
    echo
    echo "ARGS:"
    echo
    echo "!i = ${!i}"
    echo "0 = ${0}" #/usr/local/bin/play
    echo "1 = ${1}"
    echo "2 = ${2}"
    echo "3 = ${3}"
    echo "4 = ${4}"
    echo "5 = ${5}"
    echo "6 = ${6}"
    echo "7 = ${7}"
    exit
fi


if [[ ${!i} = install ]]; then
    ((i++))
    brew install "${2}"
fi
if [[ ${!i} = reinstall ]]; then
    ((i++))
    brew reinstall "${2}"
fi
if [[ ${!i} = check* ]]; then
    ((i++))
    checkbrew
fi

done
