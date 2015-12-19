#!/bin/bash
set -e
cd "$(dirname "$0")"
git pull
function doIt() {
	rsync --exclude ".git/" --exclude ".DS_Store" --exclude "bootstrap.sh" --exclude "README.md" -av . ~
}
if [ "$1" == "--force" -o "$1" == "-f" ]; then
	doIt
else
	read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1
	echo
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		doIt
	fi
if [ -d ~/QuickVim ]
		then
				echo '~/QuickVim exists'
                cd ~/QuickVim
                ~/QuickVim/./quick-vim install
		else
				echo 'cloning ~/QuickVim'
				git clone https://github.com/randymcmillan/QuickVim.git ~/QuickVim
				cd ~/QuickVim
				echo $PWD
                ~/QuickVim/./quick-vim upgrade

		fi
unset doIt
source ~/.bash_profile
source ~/.aliases
fi
