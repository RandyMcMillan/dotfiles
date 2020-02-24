#!/usr/bin/env bash

installVim() {
echo 'installVim'
    getpid;

    read -p "Install Vim? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then

    ## Collect task count
    taskCount=1
    tasksDone=0

    while [ $tasksDone -le $taskCount ]; do

        #sudo rm -rf ~/.vim_runtime
        if [ -d "$HOME/.vim_runtime/" ]; then
          cd ~/.vim_runtime
          git pull -f  origin master
          increment
          sh ~/.vim_runtime/install_awesome_vimrc.sh
          increment
          #we exclude from ~/ because we link to here
          ln -sf ~/dotfiles/.vimrc ~/.vim_runtime/my_configs.vim
          increment

        else

          git clone --depth=1 https://github.com/randymcmillan/vimrc.git ~/.vim_runtime
          increment
          sh ~/.vim_runtime/install_awesome_vimrc.sh
          increment
          ln -sf ~/dotfiles/.vimrc ~/.vim_runtime/my_configs.vim
          increment
        fi

    done
    fi
    echo

}
#installVim