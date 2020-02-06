#!/usr/bin/env bash

#sudo rm -rf ~/.vim_runtime
if [ -d "$HOME/.vim_runtime/" ]; then
echo "Directory ~/.vim_runtime exists."
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

cd "$(dirname "${BASH_SOURCE}")";
#git pull origin master;


function doIt() {
	rsync --exclude ".git/" \
        --exclude ".atom" \
		--exclude ".DS_Store" \
		--exclude ".vimrc" \
		--exclude "bootstrap.sh" \
		--exclude "README.md" \
		--exclude "LICENSE-MIT.txt" \
		--exclude "brew.sh" \
		--exclude ".bash_profile" \
		--exclude ".bash_prompt" \
		--exclude ".editorconfig" \
		--exclude ".functions" \
		--exclude ".gvimrc" \
		--exclude ".macos" \
		--exclude ".osx" \
		--exclude ".editorconfig" \
	-avh --no-perms . ~;

ln -sf ~/dotfiles/.bash_profile ~/.bash_profile
ln -sf ~/dotfiles/.bash_prompt  ~/.bash_prompt
ln -sf ~/dotfiles/.functions    ~/.functions
ln -sf ~/dotfiles/.gvimrc       ~/.gvimrc
ln -sf ~/dotfiles/.macos        ~/.macos
ln -sf ~/dotfiles/.osx          ~/.osx
#ln -sf ~/dotfiles/.editorconfig ~/.editorconfig

source ~/.bash_profile;
source ~/.bash_prompt;
source ~/.functions

if  csrutil status | grep 'disabled' &> /dev/null; then
    printf "System Integrity Protection status: \033[1;31mdisabled\033[0m\n";

		source ~/.macos;
		source ~/.osx;

    else

    printf "System Integrity Protection status: \033[1;32menabled\033[0m\n";
		printf "Some settings in  ~/.macos need this to be disabled!\n"
		printf "To boot into recovery mode, restart your Mac and hold Command+R as it boots. You’ll enter the recovery environment.\n Click the “Utilities” menu and select “Terminal” to open a terminal window.\n"
		printf "$ csrutil disable\n"

    fi
#https://help.github.com/en/github/authenticating-to-github/checking-for-existing-gpg-keys
gpg --list-secret-keys --keyid-format LONG

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
