#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
	#REF:https://github.com/sindresorhus/quick-look-plugins
        brew install --cask qlcolorcode
        brew install --cask qlstephen
        brew install --cask qlmarkdown
        brew install --cask quicklook-json
        brew install --cask qlimagesize
        brew install --cask suspicious-package
        brew install --cask quicklookase
        brew install --cask qlvideo

    else
	#example - execute script with perl
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        checkbrew

    fi
}
checkbrew
