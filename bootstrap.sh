#!/usr/bin/env bash

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


installVim() {

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

}

installVim

linkAndSource() {

    ## Collect task count
    taskCount=12
    tasksDone=0

    getpid;

    while [ $tasksDone -le $taskCount ]; do

        ln -sf ~/dotfiles/.bash_profile ~/.bash_profile
        increment
        ln -sf ~/dotfiles/.bash_prompt  ~/.bash_prompt
        increment
        ln -sf ~/dotfiles/.functions    ~/.functions
        increment
        ln -sf ~/dotfiles/.gvimrc       ~/.gvimrc
        increment
        ln -sf ~/dotfiles/.macos        ~/.macos
        increment
        ln -sf ~/dotfiles/.osx          ~/.osx
        increment
        ln -sf ~/dotfiles/.editorconfig ~/.editorconfig
        increment

        source ~/.bash_profile;
        increment
        source ~/.bash_prompt;
        increment
        source ~/.functions
        increment
        source ~/.macos;
        increment
        source ~/.osx;
        increment

    done

}

#linkAndSource

configHOSTSfile() {

#REF:https://github.com/StevenBlack/hosts.git

    read -p "Config hosts file? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git clone --depth 1 https://github.com/StevenBlack/hosts.git
        cd hosts && python3 -m pip install --user -r requirements.txt
        python3 testUpdateHostsFile.py
        python3 updateHostsFile.py -a -r -e fakenews gambling porn social
		fi

}
configHOSTSfile

configGithub() {

    getpid;

    read -p "Config github? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
    #https://help.github.com/en/github/authenticating-to-github/checking-for-existing-gpg-keys
    gpg --list-secret-keys --keyid-format LONG
    increment
    echo randymcmillan | read -p 'ENTER your Github.com username: ' GITHUB_USER_NAME
    #read -sp 'Password: ' GITHUB_USER_PASSWORD
    git config --global user.name $GITHUB_USER_NAME
    echo Thankyou $GITHUB_USER_NAME
    echo randy.lee.mcmillan@gmail.com | read -p 'ENTER your Github.com user email: ' GITHUB_USER_EMAIL
    git config --global user.email $GITHUB_USER_EMAIL
    echo Thankyou $GITHUB_USER_NAME for your email.
    echo 97966C06BB06757B | read -p 'ENTER your public gpg signing key id: ' PUBLIC_GPG_SIGNING_KEY_ID
    git config --global user.signingkey $PUBLIC_GPG_SIGNING_KEY_ID
    echo Thankyou $GITHUB_USER_NAME for public gpg signing key id.
    fi;

}

configGithub

function doIt() {

    ## Collect task count
    taskCount=2
    tasksDone=0

    getpid;

while [ $tasksDone -le $taskCount ]; do

    sudo rsync --exclude ".git/" \
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
    increment;
    done

    ## Collect task count
    taskCount=11
    tasksDone=0
    getpid;

while [ $tasksDone -le $taskCount ]; do

    if  csrutil status | grep 'disabled' &> /dev/null; then
        printf "System Integrity Protection status: \033[1;31mdisabled\033[0m\n";
        increment;
        sudo pmset -a hibernatemode 0
        increment;
        yes | sudo rm /private/var/vm/sleepimage
        increment;
        yes | sudo touch /private/var/vm/sleepimage
        increment;
        yes | sudo chflags uchg /private/var/vm/sleepimage
        increment;
        ls -la /private/var/vm
        increment;
    #    sudo defaults write /.Spotlight-V100/VolumeConfiguration Exclusions -array "/Volumes"
    #    increment;
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
        increment
        # Load new settings before rebuilding the index
        killall mds > /dev/null 2>&1
        increment;
        # Make sure indexing is enabled for the main volume
        sudo mdutil -i on / > /dev/null
        increment;
        # Rebuild the index from scratch
        sudo mdutil -E / > /dev/null
        increment;
        #defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true
        increment;
        hash tmutil &> /dev/null && sudo tmutil disable
        increment;
    #    defaults write ~/Library/Preferences/org.gpgtools.gpgmail SignNewEmailsByDefault -bool false
    #    increment

    else

        getpid;

        printf "System Integrity Protection status: \033[1;32menabled\033[0m\n";
        increment;
        printf "Some settings in  ~/.macos need this to be disabled!\n"
        increment;
        printf "To boot into recovery mode, restart your Mac and hold Command+R as it boots. You’ll enter the recovery environment.\n Click the “Utilities” menu and select “Terminal” to open a terminal window.\n"
        increment;
        printf "$ csrutil disable\n"
        increment;

    fi
done
}

if [ "$1" == "--force" -o "$1" == "-f" ]; then

    getpid;
    doIt;

else

    read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1;
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        getpid;
        doIt;
    fi;
fi;
unset doIt;
