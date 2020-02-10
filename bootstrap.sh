#!/usr/bin/env bash
progressBarWidth=20

# Function to draw progress bar
progressBar () {

  # Calculate number of fill/empty slots in the bar
  progress=$(echo "$progressBarWidth/$taskCount*$tasksDone" | bc -l)
  fill=$(printf "%.0f\n" $progress)
  if [ $fill -gt $progressBarWidth ]; then
    fill=$progressBarWidth
  fi
  empty=$(($fill-$progressBarWidth))

  # Percentage Calculation
  percent=$(echo "100/$taskCount*$tasksDone" | bc -l)
  percent=$(printf "%0.2f\n" $percent)
  if [ $(echo "$percent>100" | bc) -gt 0 ]; then
    percent="100.00"
  fi

  # Output to screen
  printf "\r["
  printf "%${fill}s" '' | tr ' ' ▉
  printf "%${empty}s" '' | tr ' ' ░
  printf "] $percent%% - $text "
}

increment(){

# Do your task
  (( tasksDone += 1 ))

  # Add some friendly output
  text=$(echo "somefile-$tasksDone.dat")

  # Draw the progress bar
  progressBar $taskCount $taskDone $text

  sleep 0.01

}

## Collect task count
taskCount=33
tasksDone=0

while [ $tasksDone -le $taskCount ]; do

    #do task

    #sudo rm -rf ~/.vim_runtime
    if [ -d "$HOME/.vim_runtime/" ]; then
    echo "Directory ~/.vim_runtime exists."
    increment
      cd ~/.vim_runtime
    increment
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
    #then
    increment




    #do task

    #then
    increment



done

echo






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

#cd "$(dirname "${BASH_SOURCE}")";
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

		# Remove the sleep image file to save disk space
		sudo rm /private/var/vm/sleepimage
		# Create a zero-byte file instead…
		sudo touch /private/var/vm/sleepimage
		# …and make sure it can’t be rewritten
		sudo chflags uchg /private/var/vm/sleepimage


		###############################################################################
# Spotlight                                                                   #
###############################################################################

# Hide Spotlight tray-icon (and subsequent helper)
#sudo chmod 600 /System/Library/CoreServices/Search.bundle/Contents/MacOS/Search
# Disable Spotlight indexing for any volume that gets mounted and has not yet
# been indexed before.
# Use `sudo mdutil -i off "/Volumes/foo"` to stop indexing any volume.
sudo defaults write /.Spotlight-V100/VolumeConfiguration Exclusions -array "/Volumes"
# Change indexing order and disable some search results
# Yosemite-specific search results (remove them if you are using macOS 10.9 or older):
# 	MENU_DEFINITION
# 	MENU_CONVERSION
# 	MENU_EXPRESSION
# 	MENU_SPOTLIGHT_SUGGESTIONS (send search queries to Apple)
# 	MENU_WEBSEARCH             (send search queries to Apple)
# 	MENU_OTHER
defaults write com.apple.spotlight orderedItems -array \
	'{"enabled" = 1;"name" = "APPLICATIONS";}' \
	'{"enabled" = 1;"name" = "SYSTEM_PREFS";}' \
	'{"enabled" = 1;"name" = "DIRECTORIES";}' \
	'{"enabled" = 1;"name" = "PDF";}' \
	'{"enabled" = 1;"name" = "FONTS";}' \
	'{"enabled" = 0;"name" = "DOCUMENTS";}' \
	'{"enabled" = 0;"name" = "MESSAGES";}' \
	'{"enabled" = 0;"name" = "CONTACT";}' \
	'{"enabled" = 0;"name" = "EVENT_TODO";}' \
	'{"enabled" = 0;"name" = "IMAGES";}' \
	'{"enabled" = 0;"name" = "BOOKMARKS";}' \
	'{"enabled" = 0;"name" = "MUSIC";}' \
	'{"enabled" = 0;"name" = "MOVIES";}' \
	'{"enabled" = 0;"name" = "PRESENTATIONS";}' \
	'{"enabled" = 0;"name" = "SPREADSHEETS";}' \
	'{"enabled" = 0;"name" = "SOURCE";}' \
	'{"enabled" = 0;"name" = "MENU_DEFINITION";}' \
	'{"enabled" = 0;"name" = "MENU_OTHER";}' \
	'{"enabled" = 0;"name" = "MENU_CONVERSION";}' \
	'{"enabled" = 0;"name" = "MENU_EXPRESSION";}' \
	'{"enabled" = 0;"name" = "MENU_WEBSEARCH";}' \
	'{"enabled" = 0;"name" = "MENU_SPOTLIGHT_SUGGESTIONS";}'
# Load new settings before rebuilding the index
killall mds > /dev/null 2>&1
# Make sure indexing is enabled for the main volume
sudo mdutil -i on / > /dev/null
# Rebuild the index from scratch
sudo mdutil -E / > /dev/null
###############################################################################
# Time Machine                                                                #
###############################################################################

# Prevent Time Machine from prompting to use new hard drives as backup volume
defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true

# Disable local Time Machine backups
hash tmutil &> /dev/null && sudo tmutil disablelocal

###############################################################################
# GPGMail 2                                                                   #
###############################################################################

# Disable signing emails by default
defaults write ~/Library/Preferences/org.gpgtools.gpgmail SignNewEmailsByDefault -bool false


    else

    printf "System Integrity Protection status: \033[1;32menabled\033[0m\n";
		printf "Some settings in  ~/.macos need this to be disabled!\n"
		printf "To boot into recovery mode, restart your Mac and hold Command+R as it boots. You’ll enter the recovery environment.\n Click the “Utilities” menu and select “Terminal” to open a terminal window.\n"
		printf "$ csrutil disable\n"

    fi
#https://help.github.com/en/github/authenticating-to-github/checking-for-existing-gpg-keys
gpg --list-secret-keys --keyid-format LONG
read -p 'ENTER your Github.com username: ' GITHUB_USER_NAME
#read -sp 'Password: ' GITHUB_USER_PASSWORD
git config --global user.name $GITHUB_USER_NAME
echo
echo Thankyou $GITHUB_USER_NAME
read -p 'ENTER your Github.com user email: ' GITHUB_USER_EMAIL
git config --global user.email $GITHUB_USER_EMAIL
echo
echo Thankyou $GITHUB_USER_NAME for your email.
read -p 'ENTER your public gpg signing key id: ' PUBLIC_GPG_SIGNING_KEY_ID
git config --global user.signingkey $PUBLIC_GPG_SIGNING_KEY_ID
echo
echo Thankyou $GITHUB_USER_NAME for public gpg signing key id.

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
