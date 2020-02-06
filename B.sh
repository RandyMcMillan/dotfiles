#!/usr/bin/env bash
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
