#!/usr/bin/env bash
install-mac-vim() {

sudo rm -rf /Applications/MacVim.app
brew cask install macvim

}
install-vim() {

    read -p "Install Vim? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then


        #sudo rm -rf ~/.vim_runtime
        if [ -d "$HOME/.vim_runtime/" ]; then
          cd ~/.vim_runtime
          git pull -f  origin master
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
cd $DOTFILES
if [[ "$OSTYPE" == "darwin"* ]]; then
    install-mac-vim
fi

}
install-vim
git config --global core.editor vim

