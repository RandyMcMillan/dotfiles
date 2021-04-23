#!/usr/bin/env bash

if hash git 2>/dev/null; then
    git config --global core.editor vim
    git config --global pull.rebase true
else
    if hash brew 2>/dev/null; then
        brew install git
    fi
    if hash apt 2>/dev/null; then
        apt install git
    fi
    if hash apk 2>/dev/null; then
        apk add git
    fi
fi

install-vim() {
#WE install this regaurdless of OSTYPE
read -t 1 -p "Install Vim? (y/n) " -n 1;
echo "";
if [[ $REPLY =~ ^[Yy]$ ]]; then
    #sudo rm -rf ~/.vim_runtime
    if [ -d "$HOME/.vim_runtime/" ]; then
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
fi
echo
if [[ "$OSTYPE" == "darwin"* ]]; then
    if hash brew 2>/dev/null; then
        if ! hash mvim 2>/dev/null; then
            read -t 1 -p "Install MacVim? (y/n) " -n 1;
            echo "";
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                if  ! hash mvim 2>/dev/null; then
                    brew install -f macvim
                    brew link --overwrite macvim
                elif
                    hash mvim 2>/dev/null; then
                    echo MacVim already installed.
                    echo
                fi
            fi
        fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    fi
    if ! hash tccutil 2>/dev/null; then
        brew install tccutil
        if ! hash dockutil 2>/dev/null; then
            curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
            chmod a+x /usr/local/bin/dockutil
        fi
    else

        MACVIM=$(find /usr/local/Cellar/macvim -name MacVim.app)
        export MACVIM
        dockutil --add $MACVIM --replacing 'MacVim'

    fi
fi
}
install-vim
