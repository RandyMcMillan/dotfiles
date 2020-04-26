#!/usr/bin/env bash

install-iterm2() {

    if hash brew 2>/dev/null; then

        brew cask install iterm2
        brew install tccutil
        curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
        chmod a+x /usr/local/bin/dockutil
        dockutil --add '/Applications/iTerm.app' --replacing 'iTerm'


    else

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew

    fi

}
ln -sf $(pwd)/init/com.googlecode.iterm2.plist ~/Library/Preferences/
install-iterm2
