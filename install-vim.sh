#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo SCRIPT_DIR=$SCRIPT_DIR

ARCH=$(uname -m);
export ARCH
echo ARCH=$ARCH
X86_64HASH=e7418487671d8dac970dcfdbbdf739c12011474f
export X86_64HASH

BREW=$(which brew)
export BREW

echo X86_64HASH=$X86_64HASH

if [ hash ssh-agent 2>/dev/null ]; then
    ssh-agent ssh-add
else
    echo "if fail try make config-github"
    echo "if fail try make config-git"
fi
if [ hash $BREW 2>/dev/null ]; then
    $BREW install git bash llvm
fi
if [ hash git  2>/dev/null ]; then
    git config --global core.editor vim
fi
if [ hash apt  2>/dev/null ]; then
    apt install git bash
fi
if [ hash apk  2>/dev/null ]; then
    apk add git bash
fi

install-vim() {
# brew uninstall  --ignore-dependencies --force ruby perl vim && brew install vim && brew link vim
#WE install this regaurdless of OSTYPE
VIMRC_REPO="https://github.com/randymcmillan/vimrc.git"
export VIMRC_REPO
echo $VIMRC_REPO
VIMRC_DESTINATION=$HOME/.vim_runtime
export VIMRC_DESTINATION
echo VIMRC_DESTINATION=$VIMRC_DESTINATION
#read -t 5 -p "Install .vim_runtime ? (y/n) " -n 1;
#if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d "$VIMRC_DESTINATION" ]; then
      pushd $VIMRC_DESTINATION
      git pull -f origin master
      python3 -m pip install --user requests
      if [ ! "$ARCH" = "x86_64" ]; then
          python3 update_plugins.py
      else
          pushd $VIMRC_DESTINATION && git checkout $X86_64HASH
      fi
      sh $VIMRC_DESTINATION/install_awesome_vimrc.sh
      #we exclude from ~/ because we link to here
      cat $SCRIPT_DIR/.vimrc > $VIMRC_DESTINATION/my_configs.vim
      popd
    else
      git clone -b v0.0.1  https://github.com/randymcmillan/vimrc.git $VIMRC_DESTINATION
      pushd $VIMRC_DESTINATION && git checkout $X86_64HASH
      sh $VIMRC_DESTINATION/install_awesome_vimrc.sh
      cat $SCRIPT_DIR/.vimrc > $VIMRC_DESTINATION/my_configs.vim
    fi
#fi
}

MACVIM=$(find $(brew --prefix) -name MacVim.app)
export MACVIM
echo   $MACVIM
MVIM=$(find $(brew --prefix) -name mvim)
export MVIM
echo   $MVIM

install-macvim(){
if [[ "$OSTYPE" == "darwin"* ]]; then
    if hash $BREW 2>/dev/null; then
        if ! hash mvim 2>/dev/null; then
            read -t 5 -p "Install MacVim? (y/n) " -n 1;
            echo "";
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                rm -f /usr/local/bin/*vi*
                if [ ! hash mvim 2>/dev/null ]; then
                    # brew link --overwrite macvim
                    $BREW install -f homebrew/cask/macvim
                    $BREW link --overwrite macvim
                else
                    echo MacVim already installed.
                    echo
                    $BREW upgrade macvim
                fi
            fi
            if ! hash tccutil 2>/dev/null; then
                $BREW install tccutil
            fi
            if ! hash dockutil 2>/dev/null; then
                curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
                chmod a+x /usr/local/bin/dockutil
                MACVIM=$(find $(brew --prefix) -name MacVim.app)
                echo $MACVIM
                export MACVIM
                dockutil --add $MACVIM --replacing 'MacVim'
            fi
        fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    fi
fi
which vim
}
install-macvim
install-vim
