#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update

        #install brew libs
        brew install ruby@2.5.8
        brew install brew-gem

        echo 'export PATH="/usr/local/opt/ruby@2.5.8/bin:$PATH"' >> ~/.bash_profile
        brew unlink ruby@2.4
        brew unlink ruby@2.5
        brew link --force  ruby@2.5.8
        which ruby
        which gem
        gem update --system
        gem list
        gem outdated
        gem update
        brew gem install pluto
        brew gem install jekyll

    else
	#example - execute script with perl
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        checkbrew

    fi
}
checkbrew
