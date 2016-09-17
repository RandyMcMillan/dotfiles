#!/usr/bin/env bash
# Install command-line tools using Homebrew.
# Ask for the administrator password upfront.
sudo -v

# Keep-alive: update existing `sudo` time stamp until the script has finished.
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# Make sure we’re using the latest Homebrew.
brew update
brew install cask

# Upgrade any already-installed formulae.
brew upgrade --all

#iTerm2
brew upgrade Caskroom/cask/iterm2

#Latex/MacTex
#REF: http://rpi.edu/dept/arc/training/latex/resumes/
#These were abel to get working easy
brew install Caskroom/cask/texshop

#https://github.com/suan/vim-instant-markdown.git
npm -g install instant-markdown-d
brew upgrade grip
npm install -g markdown-pdf

# Install GNU core utilities (those that come with OS X are outdated).
# Don’t forget to add `$(brew --prefix coreutils)/libexec/gnubin` to `$PATH`.
brew install coreutils
sudo ln -s /usr/local/bin/gsha256sum /usr/local/bin/sha256sum

# Install some other useful utilities like `sponge`.
brew install moreutils

# Install GNU `find`, `locate`, `updatedb`, and `xargs`, `g`-prefixed.
brew install findutils

# Install GNU `sed`, overwriting the built-in `sed`.
brew install gnu-sed --with-default-names

# Install Bash 4.
# Note: don’t forget to add `/usr/local/bin/bash` to `/etc/shells` before
# running `chsh`.
brew install bash
brew tap homebrew/versions
brew install bash-completion2
brew install cmake
#brew install multimarkdown
# Install `wget` with IRI support.
brew install wget --with-iri

#repurpose CAPS LOCK TO ESC
brew install Caskroom/cask/seil

#Coda
brew install Caskroom/cask/coda
brew install coda-cli



#brew upgrade homebrew/fuse/ifuse
brew upgrade Caskroom/cask/osxfuse
brew upgrade homebrew/fuse/sshfs
# Install more recent versions of some OS X tools.
brew upgrade vim --override-system-vi
brew upgrade macvim
brew upgrade homebrew/dupes/grep
brew upgrade homebrew/dupes/openssh
#brew upgrade homebrew/dupes/screen
brew upgrade homebrew/php/php56 --with-gmp
#brew cask upgrade xampp
#brew cask upgrade etom
brew upgrade Caskroom/cask/cyberduck
brew upgrade Caskroom/cask/airserver
#pdf tools
#brew upgrade qpdf
brew upgrade pdf2svg
brew upgrade svg2pdf
brew upgrade diff-pdf
#brew upgrade htmldoc
brew upgrade texi2html
brew upgrade xpdf
#brew upgrade pdf2htmlex
#brew upgrade pstoedit
brew cask upgrade combine-pdfs
brew cask upgrade pdf-toolbox


brew upgrade Caskroom/cask/xnconvert


#Spotify
brew upgrade Caskroom/cask/spotify

#Swift language
brew upgrade swiftlint
brew upgrade swift-package-manager

# Install font tools.
#brew tap bramstein/webfonttools
#brew upgrade sfnt2woff
#brew upgrade sfnt2woff-zopfli
#brew upgrade woff2

# Install some CTF tools; see https://github.com/ctfs/write-ups.
#brew upgrade aircrack-ng
#brew upgrade bfg
#brew upgrade binutils
#brew upgrade binwalk
#brew upgrade cifer
#brew upgrade dex2jar
#brew upgrade dns2tcp
#brew upgrade fcrackzip
#brew upgrade foremost
#brew upgrade hashpump
#brew upgrade hydra
#brew upgrade john
#brew upgrade knock
#brew upgrade netpbm
#brew upgrade nmap
#brew upgrade pngcheck
#brew upgrade socat
#brew upgrade sqlmap
#brew upgrade tcpflow
#brew upgrade tcpreplay
#brew upgrade tcptrace
#brew upgrade ucspi-tcp # `tcpserver` etc.
#brew upgrade xz

# Install other useful binaries.
brew upgrade ack
brew upgrade dark-mode

#git tools
brew upgrade git
brew upgrade git-lfs
#brew install hub
#brew install imagemagick --with-webp
#brew install lua
brew upgrade lynx
#brew install p7zip
#brew install pigz
#brew install pv
#brew install rename
#brew install rhino
#brew install speedtest_cli
#brew install ssh-copy-id
#brew install testssl
#brew install tree
#brew install webkit2png
#brew install zopfli
brew upgrade keychain

#adobe
#brew install Caskroom/cask/adobe-creative-cloud
#brew install Caskroom/cask/adobe-creative-cloud-cleaner-tool
#brew cask install adobe-reader
#brew cask install flash
#brew install get-flash-videos
#brew install Caskroom/cask/adobe-acrobat
#brew install Caskroom/cask/adobe-illustrator-cc
#brew install Caskroom/cask/adobe-photoshop-cc

#twitter
brew install t

#Snitch
brew upgrade Caskroom/cask/micro-snitch --force
brew upgrade Caskroom/cask/little-snitch --force
brew install Caskroom/cask/vyprvpn

mkdir -p ~/.rvm/src && cd ~/.rvm/src && rm -rf ./rvm && \
git clone --depth 1 git://github.com/wayneeseguin/rvm.git && \
cd rvm && ./install

# Remove outdated versions from the cellar.
brew cleanup

