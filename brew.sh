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
for pkg in\
 cask \
Caskroom/cask/iterm2 \
R \
Caskroom/cask/texshop \
homebrew/science \
grip\
 evince\
 coreutils\
 moreutils\
 findutils\
 gnu-sed\
  bash\
  homebrew/versions \
bash-completion2\
 cmake\
 vim\
 macvim\
 wget\
 Caskroom/cask/seil\
 Caskroom/cask/coda \
coda-cli\
 Caskroom/cask/osxfuse\
  homebrew/fuse/sshfs\
 Caskroom/cask/cyberduck \
pdf2svg\
 svg2pdf\
 diff-pdf\
 texi2html\
 xpdf\
 Caskroom/cask/combine-pdfs \
Caskroom/cask/pdf-toolbox\
 Caskroom/cask/xnconvert\
 Caskroom/cask/spotify \
swiftlint\
 swift-package-manager\
 ack\
 dark-mode\
 git\
 git-lfs\
 lynx\
 keychain\
 t \
Caskroom/cask/micro-snitch \
Caskroom/cask/little-snitch \
Caskroom/cask/vyprvpn \
Caskroom/cask/openoffice; do
    if brew list -1 | grep -q "^${pkg}\$"; then
        #echo "Package '$pkg' is installed"
        brew upgrade $pkg
    else
        #echo "Package '$pkg' is not installed"
        brew install $pkg
    fi
done


#brew install macvim --override-system-vim

#adobe
#brew upgrade Caskroom/cask/adobe-creative-cloud
#brew upgrade Caskroom/cask/adobe-creative-cloud-cleaner-tool
#brew cask upgrade adobe-reader
#brew cask upgrade flash
#brew upgrade get-flash-videos
#brew upgrade Caskroom/cask/adobe-acrobat
#brew upgrade Caskroom/cask/adobe-illustrator-cc
#brew upgrade Caskroom/cask/adobe-photoshop-cc

mkdir -p ~/.rvm/src && cd ~/.rvm/src && rm -rf ./rvm && \
git clone --depth 1 git://github.com/wayneeseguin/rvm.git && \
cd rvm && ./install

# Remove outdated versions from the cellar.
brew cleanup
