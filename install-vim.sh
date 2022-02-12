#!/usr/bin/env bash
if [ hash ssh-add 2>/dev/null ]; then
    ssh-add
fi
if [ hash brew 2>/dev/null ]; then
    brew install git bash llvm
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

# VIM=$(find /usr/local/Cellar/macvim -name vim)
# export VIM
# echo   $VIM

install-vim() {
#WE install this regaurdless of OSTYPE
VIMRC_REPO="https://github.com/randymcmillan/vimrc.git"
export VIMRC_REPO
echo $VIMRC_REPO
VIMRC_DESTINATION="$HOME/.vim_runtime"
export VIMRC_DESTINATION
echo $VIMRC_DESTINATION
#read -t 5 -p "Install .vim_runtime ? (y/n) " -n 1;
#if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d "$VIMRC_DESTINATION" ]; then
      cd ~/.vim_runtime
      git pull -f origin master
      python3 update_plugins.py
      sh ~/.vim_runtime/install_awesome_vimrc.sh
      #we exclude from ~/ because we link to here
      ln -sf ~/dotfiles/.vimrc ~/.vim_runtime/my_configs.vim
    else
      git clone --depth=1 https://github.com/randymcmillan/vimrc.git ~/.vim_runtime
      sh ~/.vim_runtime/install_awesome_vimrc.sh
      ln -sf ~/dotfiles/.vimrc ~/.vim_runtime/my_configs.vim
    fi
#fi
}

MACVIM=$(find /usr/local/Cellar/macvim -name MacVim.app)
export MACVIM
echo   $MACVIM
MVIM=$(find /usr/local/Cellar/macvim -name mvim)
export MVIM
echo   $MVIM

install-macvim(){
if [[ "$OSTYPE" == "darwin"* ]]; then
    if hash brew 2>/dev/null; then
        if ! hash mvim 2>/dev/null; then
            read -t 5 -p "Install MacVim? (y/n) " -n 1;
            echo "";
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                if [ ! hash mvim 2>/dev/null ]; then
                    brew link --overwrite macvim
                    brew install -f macvim
                    brew link --overwrite macvim
                else
                    echo MacVim already installed.
                    echo
                    brew upgrade macvim
                fi
            fi
            if ! hash tccutil 2>/dev/null; then
                brew install tccutil
            fi
            if ! hash dockutil 2>/dev/null; then
                curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
                chmod a+x /usr/local/bin/dockutil
                MACVIM=$(find /usr/local/Cellar/macvim -name MacVim.app)
                echo $MACVIM
                export MACVIM
                dockutil --add $MACVIM --replacing 'MacVim'
            fi
        fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    fi
fi
}
install-macvim
install-vim
