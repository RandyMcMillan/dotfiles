#!/usr/bin/env bash
#REF: https://www.virtualbox.org/wiki/Mac%20OS%20X%20build%20instructions
#REF: for manual building
checkbrew() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update
        # Upgrade any already-installed formulae.
        brew upgrade
        brew cask install vmware-fusion
	else
		/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	fi
}

checkbrew

# Remove outdated versions from the cellar.
brew cleanup
