#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update

        brew install openssl
        brew link --force  openssl

#If you need to have openssl@1.1 first in your PATH run:
  echo 'export PATH="/usr/local/opt/openssl@1.1/bin:$PATH"' >> /Users/git/.bash_profile

#For compilers to find openssl@1.1 you may need to set:
  export LDFLAGS="-L/usr/local/opt/openssl@1.1/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl@1.1/include"

#For pkg-config to find openssl@1.1 you may need to set:
  export PKG_CONFIG_PATH="/usr/local/opt/openssl@1.1/lib/pkgconfig"


        brew unlink ruby@2.4
        brew unlink ruby@2.5
        brew link --force --overwrite  ruby@2.5

        #install brew libs
        brew install ruby@2.5
        brew install brew-gem


        export LDFLAGS=-L/usr/local/opt/openssl/lib
        export CPPFLAGS=-I/usr/local/opt/openssl/include
        For pkg-config to find this software you may need to set:
        export PKG_CONFIG_PATH=/usr/local/opt/openssl/lib/pkgconfig

        echo 'export PATH="/usr/local/opt/ruby@2.5/bin:$PATH"' >> ~/.bash_profile

        which ruby
        which gem
        gem update --system
        gem list
        gem outdated
        gem update

    else
	#example - execute script with perl
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        checkbrew

    fi
}
checkbrew
