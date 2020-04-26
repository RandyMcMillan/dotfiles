#!/usr/bin/env bash

B() {

    if hash brew 2>/dev/null; then
        brew update
        brew upgrade
        #install brew libs
        brew install jq
        # ₿
        # Set computer name (as done via System Preferences → Sharing)
        scutil --get HostName
        scutil --get LocalHostName
        scutil --get ComputerName
        export COMPUTER_NAME=$(echo '"\u20BF"' | jq .) &&
        export COMPUTER_NAME=$(echo "${COMPUTER_NAME//\"}")
        echo $COMPUTER_NAME &&
        sudo scutil --set ComputerName "$COMPUTER_NAME"
        sudo scutil --set HostName "$COMPUTER_NAME"
        #sudo scutil --set LocalHostName "$COMPUTER_NAME"
        scutil --get HostName
        scutil --get LocalHostName
        scutil --get ComputerName
        exit
        #sudo scutil --set LocalHostName $COMPUTER_NAME && \
        #sudo defaults write /Library/Preferences/SystemConfiguration/com.apple.smb.server NetBIOSName -string "$COMPUTER_NAME"

    else

    #example - execute script with perl
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    B

    fi
}

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    B
elif [[ "$OSTYPE" == "darwin"* ]]; then
    B
elif [[ "$OSTYPE" == "freebsd"* ]]; then
    echo TODO add support for $OSTYPE
else
    echo TODO add support for $OSTYPE
fi

