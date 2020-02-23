#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then
        # Make sure we’re using the latest Homebrew.
        brew update
        # Upgrade any already-installed formulae.
        brew upgrade

        #REF:https://github.com/jacobsalmela/tccutil
        brew install tccutil
        #sudo tccutil --list
        sudo sqlite3 "/Library/Application Support/com.apple.TCC/TCC.db" 'UPDATE access SET allowed = "1";'

        brew install jq
        brew install git
        brew install vim
        brew install gnupg
        brew cask install iterm2
        curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
        #chmod a+x /usr/local/bin/dockutil
        #hash -r
        #dockutil --add '/Applications/iTerm' --replacing 'iTerm'
        brew cask install gpg-suite
        brew cask install vyprvpn
        brew cask install onyx
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

        /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        checkbrew

    fi
}
checkbrew

# Save Homebrew’s installed location.
BREW_PREFIX=$(brew --prefix)

# Install GnuPG to enable PGP-signing commits.
#brew install gnupg

# Install GNU core utilities (those that come with macOS are outdated).
# Don’t forget to add `$(brew --prefix coreutils)/libexec/gnubin` to `$PATH`.
#brew install coreutils
#ln -s "${BREW_PREFIX}/bin/gsha256sum" "${BREW_PREFIX}/bin/sha256sum"
#
## Install some other useful utilities like `sponge`.
#brew install moreutils
## Install GNU `find`, `locate`, `updatedb`, and `xargs`, `g`-prefixed.
#brew install findutils
## Install GNU `sed`, overwriting the built-in `sed`.
#brew install gnu-sed --with-default-names
## Install a modern version of Bash.
#brew install bash
#brew install bash-completion2

## Switch to using brew-installed bash as default shell
#if ! fgrep -q "${BREW_PREFIX}/bin/bash" /etc/shells; then
#  echo "${BREW_PREFIX}/bin/bash" | sudo tee -a /etc/shells;
#  chsh -s "${BREW_PREFIX}/bin/bash";
#fi;

# Install GnuPG to enable PGP-signing commits.
#brew install gnupg

#travisci
#brew install travis

#python dev
#brew install math
#brew install gmpy2
#brew install objc

# Install `wget` with IRI support.
#brew install wget --with-iri

# Install more recent versions of some macOS tools.
#brew install vim --with-override-system-vi
#brew install grep
#brew install openssh
#brew install screen
#brew install php
#brew install gmp

# Install font tools.
# brew tap bramstein/webfonttools
# brew install sfnt2woff
# brew install sfnt2woff-zopfli
# brew install woff2

# Install some CTF tools; see https://github.com/ctfs/write-ups.
#brew install aircrack-ng
#brew install bfg
#brew install binutils
#brew install binwalk
#brew install cifer
#brew install dex2jar
#brew install dns2tcp
#brew install fcrackzip
#brew install foremost
#brew install hashpump
#brew install hydra
#brew install john
#brew install knock
#brew install netpbm
#brew install nmap
#brew install pngcheck
#brew install socat
#brew install sqlmap
#brew install tcpflow
#brew install tcpreplay
#brew install tcptrace
#brew install ucspi-tcp # `tcpserver` etc.
#brew install xpdf
#brew install xz

## Install other useful binaries.
#brew install ack
##brew install exiv2
#brew install git
#brew install git-lfs
#brew install gs
#brew install imagemagick --with-webp
#brew install lua
#brew install lynx
#brew install p7zip
#brew install pigz
#brew install pv
#brew install rename
#brew install rlwrap
#brew install ssh-copy-id
#brew install tree
#brew install vbindiff
#brew install zopfli

# Remove outdated versions from the cellar.
brew cleanup
