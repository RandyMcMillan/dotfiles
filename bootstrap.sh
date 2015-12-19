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
		else
				echo 'cloning'
				git clone https://github.com/randymcmillan/QuickVim.git ~/QuickVim
		fi
unset doIt
source ~/.bash_profile
source ~/.aliases


fi
