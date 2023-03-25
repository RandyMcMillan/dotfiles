#!/usr/bin/env bash

##
# Usage:
#    ./brew_install_version.sh nvm 0.39.2
#
BREW=$(which brew)
BREW developer on
# the brew package name, ex: yq
packageName=$1
# the older version to install
packageVersion=$2

# Create a new tab
HOMEBREW_NO_ENV_FILTERING="1" ## for git gpg signing
brew tap-new local/$packageName

# Extract into local tap
brew extract --version=$packageVersion $packageName local/$packageName

# Sanity check packages is present
brew search $packageName@

# Run brew install@version as usual
brew install local/$packageName/$packageName@$packageVersion

# optional, to clean up when done
# rm -rf /usr/local/Homebrew/Library/Taps/local/homebrew-$packageName/