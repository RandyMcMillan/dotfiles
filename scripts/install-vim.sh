#!/usr/bin/env bash



if hash git 2>/dev/null; then
    git config --global core.editor vim
    git config --global pull.rebase true
fi

install-vim() {
#WE install this regaurdless of OSTYPE
    read -r -p "Install Vim? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then

        #if [ -d "$HOME/.vim_runtime/" ]; then
        rm -rf ~/.vim_runtime
    #rsync -av .vim_runtime/ ~/.vim_runtime/ || exit 1
    ln -s "$PWD/.vim_runtime" ~/.vim_runtime

        #else

          #git clone --depth=1 https://github.com/randymcmillan/vimrc.git "$HOME/.vim_runtime"
          #pushd "$HOME/.vim_runtime" || exit
          #make
          #ln -sf ~/dotfiles/.vimrc ~/.vim_runtime/my_configs.vim
        #fi

    fi
    echo
if [[ "$OSTYPE" == "darwin"* ]]; then

    if hash brew 2>/dev/null; then
    read -r -p "Install MacVim? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if  ! hash mvim 2>/dev/null; then
            brew install -f macvim
            brew link --overwrite macvim
        elif
            hash mvim 2>/dev/null; then
            echo MacVim already installed.
            echo Usage:
            echo mvim .
            echo
        fi
    fi

    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

    fi
fi
}
install-vim
