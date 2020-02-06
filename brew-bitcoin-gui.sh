#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update
        # Upgrade any already-installed formulae.
        brew upgrade
				brew install autoconf
				brew install automake
				brew install libtool
				brew install pkg-config
				brew install berkeley-db4
				brew install boost
				#brew install boost-build


	else
		/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	fi
}

checkbrew

# Remove outdated versions from the cellar.
brew cleanup
