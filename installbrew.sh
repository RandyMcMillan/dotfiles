#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update
        # Upgrade any already-installed formulae.
        brew upgrade

        #install brew libs
        brew install wget
        #do something else after installed dep
        #example - pipe remote script into bash with wget
        #sudo wget -qO - https://gist.githubusercontent.com/RandyMcMillan/634bc660e03151a037a97295b01a0369/raw/28deda7c03eb4c8a300c4c3eabd76c0f732ca5da/disable.sh | bash

    else

    #example - execute script with perl
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    checkbrew

    fi
}

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    sudo apt update
    sudo apt -y install wget curl
    sudo apt install linuxbrew-wrapper
    checkbrew
elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew
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

