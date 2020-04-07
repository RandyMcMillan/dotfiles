#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        brew update
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
    sudo apt -y  build-essential curl wget file git autoconf
    sudo apt install linuxbrew-wrapper
    checkbrew
elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew
    brew install tccutil
    curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
    chmod a+x /usr/local/bin/dockutil

    brew cask install --force iterm2
    dockutil --add '/Applications/iTerm.app' --replacing 'iTerm'

    brew cask install --force macvim
    dockutil --add '/Applications/MacVim.app' --replacing 'MacVim'

    brew cask install --force docker
    dockutil --add '/Applications/Docker.app' --replacing 'Docker'

    open /Applications/Docker.app

    docker run hello-world

#elif [[ "$OSTYPE" == "cygwin" ]]; then
#    echo TODO add support for $OSTYPE
#elif [[ "$OSTYPE" == "msys" ]]; then
#    echo TODO add support for $OSTYPE
#elif [[ "$OSTYPE" == "win32" ]]; then
#    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "freebsd"* ]]; then
    echo TODO add support for $OSTYPE
else
    echo TODO add support for $OSTYPE
fi

