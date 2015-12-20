#!/bin/bash
set -e
cd "$(dirname "$0")"
git pull
function doIt() {
	rsync --exclude ".git/" --exclude ".DS_Store" --exclude "bootstrap.sh" --exclude "README.md" -avv --progress . ~
}
function installQuickVim() {
            if [ -d ~/QuickVim ]
                    then
                            echo '~/QuickVim exists'
                            cd ~/QuickVim/
                             ~/QuickVim/./quick-vim upgrade
                    else
                            echo 'cloning https://github.com/randymcmillan/QuickVim.git to ~/QuickVim'
                            git clone https://github.com/randymcmillan/QuickVim.git ~/QuickVim
                            cd ~/QuickVim/
                            ~/QuickVim/./quick-vim install


                    fi
}

if [ "$1" == "--force" -o "$1" == "-f" ]; then
	doIt
else
	read -p "Installs QuickVim [https://github.com/randymcmillan/QuickVim.git] 
    as well as the dotfiles [https://github.com/randymcmillan/dotfiles.git] files.
    This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1
	echo
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		doIt
        installQuickVim
    fi
unset doIt
unset installQuickVim
cd ~/
source ~/.bash_profile
source ~/.aliases
fi
