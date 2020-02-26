#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update
        # Upgrade any already-installed formulae.
        brew upgrade
	#REF:https://github.com/sindresorhus/quick-look-plugins
        brew cask install qlcolorcode
        brew cask install qlstephen
        brew cask install qlmarkdown
        brew cask install quicklook-json
        brew cask install qlimagesize
        brew cask install suspicious-package
        brew cask install quicklookase
        brew cask install qlvideo

    else
	#example - execute script with perl
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        checkbrew

    fi
}
checkbrew
