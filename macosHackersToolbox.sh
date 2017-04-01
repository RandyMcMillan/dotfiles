#!/usr/bin/env bash
# Install command-line tools using Homebrew.
# Ask for the administrator password upfront.
sudo -v
# Keep-alive: update existing `sudo` time stamp until the script has finished.
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &
# Make sure we’re using the latest Homebrew.
brew update
# Upgrade any already-installed formulae.
brew upgrade --all
for pkg in \
cask \
Caskroom/cask/macports \
Caskroom/cask/metasploit \
Caskroom/cask/kismac \
nmap \
sqlmap \
burp \
Caskroom/cask/burp-suite \
git \
wget \
sslscan \
Caskroom/cask/wireshark \
dupeseek \
homebrew/dupes/tcpdump \
netcat \
netcat6 \
ruby@1.9 \
postgresql \
qt5 \
;
 do
    if brew list -1 | grep -q "^${pkg}\$"; then
        echo "Package '$pkg' is installed"
        brew upgrade $pkg
    else
        echo "Package '$pkg' is not installed"
        brew install $pkg
    fi
done

curl -#L https://get.rvm.io | bash -s stable --autolibs=3 --ruby
rvm requirements
brew install autoconf automake libtool libyaml readline libksba openssl
rvm install ruby-1.9.3
rvm gemset create msf
rvm use ruby-1.9.3@msf --default

xcode-select --install

# Remove outdated versions from the cellar.
brew cleanup
