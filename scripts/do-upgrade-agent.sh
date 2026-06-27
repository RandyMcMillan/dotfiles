#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        brew update
        brew upgrade
        #install brew libs
        #do something else after installed dep
        #example - pipe remote script into bash with wget
        #sudo wget -qO - https://gist.githubusercontent.com/RandyMcMillan/634bc660e03151a037a97295b01a0369/raw/28deda7c03eb4c8a300c4c3eabd76c0f732ca5da/disable.sh | bash
    else
        #example - execute script with perl
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    if hash apt-get 2>/dev/null; then
      sudo apt-get purge do-agent
      curl -sSL https://repos.insights.digitalocean.com/install.sh | sudo bash
      /opt/digitalocean/bin/do-agent --version
      #checkbrew
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    #checkbrew
    echo TODO add support for $OSTYPE
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

