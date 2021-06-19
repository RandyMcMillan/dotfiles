#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        brew update
        brew install --cask onyx

    else
	#example - execute script with perl
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        checkbrew

    fi
}
checkbrew
