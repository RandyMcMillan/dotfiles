#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE}")";

touch ~/session.log

#git pull origin master;
#git pull origin main;

function doIt() {
	rsync --exclude ".git/" \
		--exclude ".DS_Store" \
		--exclude ".osx" \
		--exclude "bootstrap" \
		--exclude "README.md" \
		--exclude "LICENSE-MIT.txt" \
		--exclude "*.sh" \
		-avh --no-perms . ~;
	source $PWD/.bashrc;
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
