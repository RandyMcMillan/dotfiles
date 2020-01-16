#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE}")";

git pull origin master;

function doIt() {
	rsync --exclude ".git/" \
        --exclude ".atom" \
		--exclude ".DS_Store" \
		--exclude ".vimrc" \
		--exclude "bootstrap.sh" \
		--exclude "README.md" \
		--exclude "LICENSE-MIT.txt" \
		-avh --no-perms . ~;
	source ~/.bash_profile;
    if [[ -d ~/quick-vim ]]; then
        cd ~/quick-vim
        git pull
        ./quick-vim upgrade
    else
        cd ~/
        git clone --recurse-submodules -j8 https://github.com/randymcmillan/quick-vim
    fi
}

if [ "$1" == "--force" -o "$1" == "-f" ]; then
	doIt;
else
	read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1;
	echo "";
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		doIt;
	fi;
fi;
unset doIt;
