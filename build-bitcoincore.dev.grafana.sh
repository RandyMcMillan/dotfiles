#!/usr/bin/env bash

macos-build-grafana(){

echo

}
alpine-build-grafana(){

echo

}
checkbrew() {

    if hash brew 2>/dev/null; then
        brew update
        brew upgrade
        #install brew libs

    else
        #example - execute script with perl
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    #checkbrew
    echo
#for alpine
elif [[ "$OSTYPE" == "linux-musl" ]]; then
    #checkbrew
    echo
elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew
    brew install curl git go
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
    echo 'export PATH=export NVM_DIR="$HOME/.nvm"' >> /Users/git/.bash_profile
    brew unlink node node@10 node@12
    brew uninstall node node@10 node@12
    rm -rf /usr/local/Cellar/node/*
    rm -rf /usr/local/bin/npm
    brew install --force node@12 npm
    brew link --force --overwrite node@12 npm
    echo 'export PATH="/usr/local/opt/node@12/bin:$PATH"' >> /Users/git/.bash_profile
    echo 'export PATH="export GOPATH=$HOME/go/:$PATH"' >> /Users/git/.bash_profile
    cd ~/go/src/github.com/bitcoincore-dev/grafana/
    
    npm install -g npm storybook
    npm install -g yarn
    npx -p @storybook/cli sb init
    export GOPATH=$HOME/go/
    go get github.com/bitcoincore-dev/grafana
    cd ~/go/src/github.com/bitcoincore-dev/grafana/
    yarn install --pure-lockfile
    yarn start
    echo
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
