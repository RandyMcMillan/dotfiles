#!/usr/bin/env bash
if [ hash git 2>/dev/null ]; then
    git config --global core.editor vim
    git config --global pull.rebase true
else
    if [ hash brew 2>/dev/null ]; then
        brew install git
    fi
    if [ hash apt 2>/dev/null ]; then
        apt install git
    fi
    if [ hash apk 2>/dev/null ]; then
        apk add git
    fi
fi

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

install-macvim(){
if [[ "$OSTYPE" == "darwin"* ]]; then
    if hash brew 2>/dev/null; then
            read -t 5 -p "Install MacVim? (y/n) " -n 1;
            echo "";
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                    brew install -f --cask macvim
            fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    fi
    if ! hash tccutil 2>/dev/null; then
        brew install tccutil
    fi
    if ! hash dockutil 2>/dev/null; then
        sudo -s curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
        sudo -s chmod a+x /usr/local/bin/dockutil
    fi
        dockutil --add /Applications/MacVim.app --replacing 'MacVim'
fi
}
install-macvim
install-vim
