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
nmap \
Caskroom/cask/sequel-pro \
gpg \
Caskroom/cask/google-chrome \
Caskroom/cask/google-hangouts \
Caskroom/cask/google-drive \
Caskroom/cask/virtualbox \
Caskroom/cask/virtualbox-extension-pack \
Caskroom/cask/makehuman \
Caskroom/cask/onyx \
vim \
Caskroom/cask/cleanmymac \
Caskroom/cask/toau \
Caskroom/cask/mou \
Caskroom/cask/java \
Caskroom/cask/iexplorer \
Caskroom/cask/transmit \
Caskroom/cask/caffeine \
Caskroom/cask/transmit \
Caskroom/cask/bonjour-browser \
Caskroom/cask/iterm2 \
Caskroom/cask/moom \
Caskroom/cask/mactex \
coreutils \
moreutils \
findutils \
bash \
bash-completion2 \
cmake \
uncrustify \
wget \
Caskroom/cask/seil \
Caskroom/cask/coda \
coda-cli \
Caskroom/cask/osxfuse \
homebrew/fuse/sshfs \
Caskroom/cask/cyberduck \
pdf2svg \
svg2pdf \
diff-pdf \
texi2html \
xpdf \
Caskroom/cask/pdf-toolbox \
Caskroom/cask/xnconvert \
Caskroom/cask/spotify \
swift-package-manager \
ack \
dark-mode \
git \
git-lfs \
lynx \
keychain \
t \
Caskroom/cask/micro-snitch \
Caskroom/cask/little-snitch \
Caskroom/cask/vyprvpn \
python \
python2 \
python3 \
npm \
Caskroom/cask/java \
Caskroom/cask/flash-player \
Caskroom/cask/firefox \
Caskroom/cask/virtualbox \
Caskroom/cask/disk-inventory-x \
Caskroom/cask/little-snitch \
qt \
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

#help https://github.com/toland/qlmarkdown
defaults write com.apple.finder QLEnableTextSelection -bool TRUE; killall Finder

#brew install macvim --override-system-vim
#brew cask uninstall --force macvim && brew cask install macvim
#brew link --overwrite macvim
#brew install vim --override-system-vim
#needed for YouCompleteMe vim plugin
npm install xbuild

#perl
perl -MCPAN -e 'install HTML::Template'
perl -MCPAN -e 'install CGI'


#adobe
brew upgrade Caskroom/cask/adobe-creative-cloud
brew upgrade Caskroom/cask/adobe-creative-cloud-cleaner-tool
#brew cask upgrade adobe-reader
#brew cask upgrade flash
#brew upgrade get-flash-videos
brew upgrade Caskroom/cask/adobe-acrobat
brew upgrade Caskroom/cask/adobe-illustrator-cc
#brew upgrade Caskroom/cask/adobe-photoshop-cc

#emacs
brew unlink emacs
brew link --overwrite emacs-plus

mkdir -p ~/.rvm/src && cd ~/.rvm/src && rm -rf ./rvm && \
git clone --depth 1 git://github.com/wayneeseguin/rvm.git && \
cd rvm && ./install

gem install wayback_machine_downloader

# Remove outdated versions from the cellar.
brew cleanup

echo 'export PATH="/usr/local/opt/qt/bin:$PATH"' >> ~/.bash_profile
set     LDFLAGS:  -L/usr/local/opt/qt/lib
set     CPPFLAGS: -I/usr/local/opt/qt/include
