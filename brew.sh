#!/usr/bin/env bash
arg1=$1
arg2=$2
arg3=$3
arg4=$4

# Install command-line tools using Homebrew.
# Ask for the administrator password upfront.
sudo -v
# Keep-alive: update existing `sudo` time stamp until the script has finished.
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

#echo $localDate
help () {
    cat<<EOF

Usage: brew.sh [basics|google|latex|perl|git|ms|vypr|ff|help]

Commands:

        basics
        google
        latex
        perl
        git

EOF
}

if [ "$arg1" == "" ]; then
brew update
brew upgrade
help
else
brew update
brew upgrade
fi

if [[ $arg1 == "basics" ]]; then
for basics in \
cask \
coreutils \
moreutils \
findutils \
wget \
ack \
nmap \
gpg \
bash \
bash-completion2 \
Caskroom/cask/iterm2 \
keychain \
Caskroom/cask/seil \
Caskroom/cask/coda \
Caskroom/cask/bonjour-browser \
coda-cli \
Caskroom/cask/moom \
Caskroom/cask/caffeine \
Caskroom/cask/mou \
Caskroom/cask/macdown \
Caskroom/cask/toau \
Caskroom/cask/cleanmymac \
Caskroom/cask/java \
vim \
Caskroom/cask/sequel-pro \
Caskroom/cask/onyx \
Caskroom/cask/lighttable \
Caskroom/cask/soundflower \
brew-cask-completion \
Caskroom/cask/keepingyouawake \
Caskroom/cask/logisim \
Caskroom/cask/transmit;
 do
    if brew list -1 | grep -q "^${basics}\$"; then
        echo "Package '$basics' is installed"
        brew upgrade $basics
    else
        echo "Package '$basics' is not installed"
        brew install $basics
    fi
done
fi

if [[ $arg1 == "google" ]]; then
for google in \
Caskroom/cask/google-chrome \
Caskroom/cask/google-hangouts \
Caskroom/cask/google-drive;
 do
    if brew list -1 | grep -q "^${google}\$"; then
        echo "Package '$google' is installed"
        brew upgrade $google
    else
        echo "Package '$google' is not installed"
        brew install $google
    fi
done
fi
if [[ $arg1 == "latex" ]]; then
for latex in \
Caskroom/cask/mactex;
 do
    if brew list -1 | grep -q "^${latex}\$"; then
        echo "Package '$latex' is installed"
        brew upgrade $latex
    else
        echo "Package '$latex' is not installed"
        brew install $latex
    fi
done
fi
if [[ $arg1 == "perl" ]]; then
for perl in \
npm;
 do
    if brew list -1 | grep -q "^${perl}\$"; then
        echo "Package '$perl' is installed"
        brew upgrade $perl
sudo cpan App::perlbrew
cpan install Template::Toolkit
cpan -fi TryCatch

    else
        echo "Package '$perl' is not installed"
        brew install $perl
sudo cpan App::perlbrew
cpan install Template::Toolkit
cpan -fi TryCatch

    fi
done
fi

if [[ $arg1 == "adobe" ]]; then
for adobe in \
Caskroom/cask/adobe-creative-cloud \
Caskroom/cask/adobe-creative-cloud-cleaner-tool \
Caskroom/cask/adobe-acrobat \
Caskroom/cask/adobe-illustrator-cc \
Caskroom/cask/adobe-photoshop-cc;
 do
    if brew list -1 | grep -q "^${adobe}\$"; then
        echo "Package '$adobe' is installed"
        brew upgrade $adobe
    else
        echo "Package '$dobe' is not installed"
        brew install $adobe
    fi
done
fi



#for vb in \
#Caskroom/cask/virtualbox \
#Caskroom/cask/virtualbox-extension-pack;
#do doit done

#for 3d in \
#Caskroom/cask/makehuman;
#do doit done


#for dev in \
#cmake \
#uncrustify \
#lynx;
#do doit done

#for fs in \
#Caskroom/cask/disk-inventory-x \
#Caskroom/cask/osxfuse \
#homebrew/fuse/sshfs \
#Caskroom/cask/cyberduck;
#do doit done

#for pdf in \
#pdf2svg \
#svg2pdf \
#diff-pdf \
#xpdf \
#Caskroom/cask/pdf-toolbox;
#do doit done


#for spotify in \
#Caskroom/cask/spotify;
#Caskroom/cask/spotify-notifications;
#brew cask install --appdir="/Applications" spotify-notifications
#do doit done

#for swift in \
#swift-package-manager;
#do doit done

if [[ $arg1 == "git" ]]; then
for git in \
git \
git-lfs;
 do
    if brew list -1 | grep -q "^${git}\$"; then
        echo "Package '$git' is installed"
        brew upgrade $git
    else
        echo "Package '$git' is not installed"
        brew install $git
    fi
done
fi
if [[ $arg1 == "ms" ]]; then
for ms in \
Caskroom/cask/micro-snitch \
Caskroom/cask/little-snitch;
 do
    if brew list -1 | grep -q "^${ms}\$"; then
        echo "Package '$ms' is installed"
        brew upgrade $ms
    else
        echo "Package '$ms' is not installed"
        brew install $ms
    fi
done
fi
if [[ $arg1 == "vypr" ]]; then
for vypr in \
Caskroom/cask/vyprvpn;
 do
    if brew list -1 | grep -q "^${vypr}\$"; then
        echo "Package '$vypr' is installed"
        brew upgrade $vypr
    else
        echo "Package '$vypr' is not installed"
        brew install $vypr
    fi
done
fi
if [[ $arg1 == "python" ]]; then
for python in \
python \
python2 \
python3;
 do
    if brew list -1 | grep -q "^${python}\$"; then
        echo "Package '$python' is installed"
        brew upgrade $python
    else
        echo "Package '$python' is not installed"
        brew install $python
    fi
done
fi
if [[ $arg1 == "java" ]]; then
for java in \
Caskroom/cask/java;
 do
    if brew list -1 | grep -q "^${java}\$"; then
        echo "Package '$java' is installed"
        brew upgrade $java
    else
        echo "Package '$java' is not installed"
        brew install $java
    fi
done
fi
if [[ $arg1 == "ff" ]]; then
for ff in \
Caskroom/cask/firefox;
 do
    if brew list -1 | grep -q "^${ff}\$"; then
        echo "Package '$ff' is installed"
        brew upgrade $ff
    else
        echo "Package '$ff' is not installed"
        brew install $ff
    fi
done
fi
if [[ $arg1 == "extras" ]]; then
defaults write com.apple.finder QLEnableTextSelection -bool TRUE; killall Finder
#brew cask uninstall --force macvim && brew cask install macvim
#brew link --overwrite macvim
#brew install vim --override-system-vim
#needed for YouCompleteMe vim plugin
npm install xbuild

#moreperl
cpan install HTML::Template
cpan install CGI
perl -MCPAN -e 'install HTML::Template'
perl -MCPAN -e 'install CGI'

#moreemacs
brew unlink emacs
brew link --overwrite emacs-plus
git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d

#moreruby
mkdir -p ~/.rvm/src && cd ~/.rvm/src && rm -rf ./rvm && \
git clone --depth 1 git://github.com/wayneeseguin/rvm.git && \
cd rvm && ./install

#wayback
gem install wayback_machine_downloader
fi
# Remove outdated versions from the cellar.
brew cleanup
