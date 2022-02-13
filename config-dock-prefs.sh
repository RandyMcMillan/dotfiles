#!/usr/bin/env bash

brew-install-dockutils(){
if hash brew 2>/dev/null; then
    if ! hash tccutil 2>/dev/null; then
        brew install tccutil
    fi
    if ! hash dockutil 2>/dev/null; then
        curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
        chmod a+x /usr/local/bin/dockutil
    fi
else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi
}

config-dock-prefs(){
if [[ "$OSTYPE" == "darwin"* ]]; then

    #sudo dockutil --remove 'Siri' --allhomes

    sudo dockutil --remove spacer-tiles

    DOCKER=$(find /Applications -name Docker.app)
    export DOCKER
    sudo dockutil --add $DOCKER --replacing 'Docker'

    FIREFOX=$(find /Applications -name Firefox.app)
    export FIREFOX
    sudo dockutil --add $FIREFOX --after Safari --no-restart '/System/Library/User Template/English.lproj'

    ACTIVITY_MONITOR=$(find /Applications/Other -name Activity\ Monitor.app)
    export ACTIVITY_MONITOR
    sudo dockutil --add $ACTIVITY_MONITOR --replacing 'Activity Monitor'

    sudo dockutil --move 'System Preferences'      --position 1 --allhomes
    sudo dockutil --add /Applications/Utilities/Terminal.app            'Terminal'
    sudo dockutil --add /Applications/Utilities/Activity\ Montor.app    'Activity'
    sudo dockutil --add /Applications/Utilities/Airport\ Utility.app    'Aitport'
    sudo dockutil --add /Applications/TextEdit.app                      'TextEdit'
    sudo dockutil --add /Applications/Xcode.app                         'Xcode'
    sudo dockutil --add /Applications/Remote\ Desktop.app               'Remote Desktops'
    sudo dockutil --add /Applications/Spotify.app                       'Spotify'
    sudo dockutil --add vnc://M1.local --label 'M1.local' --allhomes
    sudo dockutil --add '~/Downloads' --view grid --display folder --allhomes
    sudo dockutil --add '~/Downloads' --view grid --display folder --allhomes
    sudo dockutil --add '~/Documents' --view grid --display folder --allhomes
    sudo dockutil --add '~/bitcoin'   --view grid --display folder --allhomes
    sudo dockutil --add '~/gui'       --view grid --display folder --allhomes
    sudo dockutil --add '~/dotfiles'  --view grid --display folder --allhomes

    #sudo dockutil --remove 'Siri' --allhomes

fi
}
