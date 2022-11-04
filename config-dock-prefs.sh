#!/usr/bin/env bash

# rm -f /usr/local/bin/dockutil || pass

brew-install-dockutils(){
if hash brew 2>/dev/null; then
    if hash dockutil 2>/dev/null; then
        # curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
        # sudo chmod a+x /usr/local/bin/dockutil
        #brew reinstall --force dockutil
        brew link --overwrite dockutil
    else
        brew install --force dockutil
    fi
    if hash tccutil 2>/dev/null; then
        brew reinstall --force tccutil
    else
        brew install --force tccutil
    fi
    config-dock-prefs
else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi
}

config-dock-prefs(){

if [[ $(uname) == *"Darwin"* ]]; then

    dockutil --remove 'Siri' --allhomes
    dockutil --remove spacer-tiles

    DOCKER=$(find /Applications  -name Docker.app)
    export DOCKER
    if hash dockutil 2>/dev/null; then
        echo line 32
        sudo dockutil --add $DOCKER --replacing 'Docker'
    fi

    FIREFOX=$(find /Applications  -name Firefox.app)
    export FIREFOX
    if [ ! -z "$FIREFOX" ]; then
        echo line 39
        sudo dockutil --add $FIREFOX --after Safari --no-restart '/System/Library/User Template/English.lproj'
    fi

    ACTIVITY_MONITOR=$(find -d /Applications -name Activity\ Monitor.app)
    export ACTIVITY_MONITOR
    if [ ! -z "$ACTIVITY_MONITOR" ]; then
        echo line 46
        sudo dockutil --add $ACTIVITY_MONITOR --replacing 'Activity Monitor'
    fi
    if hash dockutil 2>/dev/null; then

        sudo dockutil --add $ACTIVITY_MONITOR --replacing 'Activity Monitor'

        echo line 44
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

fi
}
brew-install-dockutils
