#!/usr/bin/env bash

if [[ "$SHELL" == "/bin/zsh" ]]; then
zsh --emulate sh
source ./checkbrew.sh
checkbrew
brew install zsh-vi-mode
# Enable vi mode
bindkey -v
# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(
  vi-mode
)
else
    echo
fi

DOTFILES=~/dotfiles
export DOTFILES

if [ -d $DOTFILES  ]; then
    cd $DOTFILES
else
   git clone https://github.com/randymcmillan/dotfiles $DOTFILES
    cd $DOTFILES
fi

#set -x #debug
## Collect task count
taskCount=0
tasksDone=0

# usage getpid [varname]
getpid(){

    pid=$(exec sh -c 'echo "$PPID"')
    #test "$1" && eval "$1=\$pid"

}

progressBarWidth=20

# Function to draw progress bar
progressBar() {

    getpid

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

increment() {

    getpid

    # Do your task
    (( tasksDone += 1 ))

    # Add some friendly output
    #text=$(echo "somefile-$tasksDone.dat")

    # Draw the progress bar
    progressBar $taskCount $taskDone $text

    sleep 0.01

}

linkAndSource() {

    read -p "link and source dotfiles? (y/n) " -n 1;
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo 'linkAndSource'
        ## Collect task count
        taskCount=12
        tasksDone=0

        getpid

        while [ $tasksDone -le $taskCount ]; do

            rm -f ~/.aliases
            ln -sf ~/dotfiles/.aliases ~/.aliases
            increment
            rm -f ~/.bash_profile
            ln -sf ~/dotfiles/.bash_profile ~/.bash_profile
            increment
            rm -f ~/.bash_prompt
            ln -sf ~/dotfiles/.bash_prompt  ~/.bash_prompt
            increment
            ln -sf ~/dotfiles/.functions    ~/.functions
            increment
            ln -sf ~/dotfiles/.gvimrc       ~/.gvimrc
            increment
            ln -sf ~/dotfiles/.osx          ~/.osx
            increment
            ln -sf ~/dotfiles/.macos        ~/.macos
            increment
            ln -sf ~/dotfiles/.editorconfig ~/.editorconfig
            increment
            ln -sf ~/dotfiles/init ~/init
            increment
            ln -sf ~/dotfiles/bin ~/bin
            increment
            ln -sf ~/dotfiles/.config ~/.config
            increment

            source ~/.aliases
            increment
            source ~/.bash_profile
            increment
            source ~/.bash_prompt
            increment
            source ~/.functions
            increment
            #echo 'source ~/.osx'
            #source ~/.osx;
            #increment
            #echo 'source ~/.macos'
            #source ~/.macos
            #increment
        done
    fi
}
linkAndSource

function doIt() {

    ## Collect task count
    taskCount=1
    tasksDone=0

    getpid

    while [ $tasksDone -le $taskCount ]; do

    echo 'rsync' && echo

    rsync --exclude ".git/" \
          --exclude ".atom" \
          --exclude ".DS_Store" \
          --exclude ".vimrc" \
          --exclude "*.sh" \
          --exclude "README.md" \
          --exclude "LICENSE-MIT.txt" \
          --exclude "hosts/" \
          --exclude "hosts/*" \
          --exclude "iterm2.json" \
          --exclude "LICENSE-MIT.txt" \
          --exclude ".macos" \
          --exclude ".osx" \
          -avh --no-perms . ~;
    increment;
    done
    echo

    ## Collect task count
    taskCount=11
    tasksDone=0
    getpid

while [ $tasksDone -le $taskCount ]; do

echo 'line 164'

if  csrutil status | grep 'disabled' &> /dev/null; then
        printf "System Integrity Protection status: \033[1;31mdisabled\033[0m\n";
        increment;
        sudo pmset -a hibernatemode 0
        increment;
        #yes | sudo chflags uchg /private/var/vm/sleepimage
        increment;
        #yes | sudo rm /private/var/vm/sleepimage
        increment;
        #yes | sudo touch /private/var/vm/sleepimage
        increment;
        #ls -la /private/var/vm
        increment;
        #sudo defaults write /.Spotlight-V100/VolumeConfiguration Exclusions -array "/Volumes"
        increment;
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
        increment;
        # Load new settings before rebuilding the index
        killall mds > /dev/null 2>&1
        increment;
        # Make sure indexing is enabled for the main volume
        sudo mdutil -i on / > /dev/null
        increment;
        # Rebuild the index from scratch
        sudo mdutil -E / > /dev/null
        increment;
        defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true
        increment;
        hash tmutil &> /dev/null && sudo tmutil disable
        increment;
        defaults write ~/Library/Preferences/org.gpgtools.gpgmail SignNewEmailsByDefault -bool false
        increment;
        defaults write com.apple.dt.Xcode DVTTextShowInvisibleCharacters 1
        defaults write com.apple.AppleMultitouchTrackpad Dragging -bool true
        defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Dragging -bool true
        defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad DragLock -bool true
        defaults write com.apple.finder AppleShowAllFiles -bool true
        defaults write com.apple.dock DragLock -bool true
        defaults write com.apple.dock wvous-bl-corner -int 11
        defaults write com.apple.dock wvous-br-corner -int 4
        defaults write com.apple.dock wvous-tl-corner -int 7
        defaults write com.apple.dock wvous-tr-corner -int 2
        killall Dock


    echo

    else

        getpid

        printf "System Integrity Protection status: \033[1;32menabled\033[0m\n";
        increment;
        printf "Some settings in  ~/.macos need this to be disabled!\n"
        increment;
        printf "To boot into recovery mode, restart your Mac and hold Command+R as it boots. You’ll enter the recovery environment.\n Click the “Utilities” menu and select “Terminal” to open a terminal window.\n"
        increment;
        printf "$ csrutil disable\n"
        increment;

    fi
echo
done
}

if [ "$1" == "--force" -o "$1" == "-f" ]; then

    echo 'getpid'
    getpid
    echo 'doIt'
    doIt;

else

		echo
    read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1;
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo 'getpid'
        getpid
        echo 'doIt'
        doIt
    fi;
fi;
unset doIt;
#open ~/init/Solarized\ Dark.terminal
