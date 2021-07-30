#!/usr/bin/env bash

config-dock-prefs(){
if [[ "$OSTYPE" == "darwin"* ]]; then
    if hash brew 2>/dev/null; then
            if ! hash tccutil 2>/dev/null; then
                brew install tccutil
            fi
            if ! hash dockutil 2>/dev/null; then
                curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
                chmod a+x /usr/local/bin/dockutil
            fi

                dockutil --remove 'Siri' --allhomes

                dockutil --remove spacer-tiles

                DOCKER=$(find /Applications -name Docker.app)
                export DOCKER
                dockutil --add $DOCKER --replacing 'Docker'

                FIREFOX=$(find /Applications -name Firefox.app)
                export FIREFOX
                dockutil --add $FIREFOX --after Safari --no-restart '/System/Library/User Template/English.lproj'

                ACTIVITY_MONITOR=$(find /Applications/Other -name Activity\ Monitor.app)
                export ACTIVITY_MONITOR
                dockutil --add $ACTIVITY_MONITOR --replacing 'Activity Monitor'

                dockutil --move 'System Preferences'      --position 1 --allhomes
                dockutil --add /Applications/Utilities/Terminal.app            'Terminal'
                dockutil --add /Applications/Utilities/Activity\ Montor.app    'Activity'
                dockutil --add /Applications/Utilities/Airport\ Utility.app    'Aitport'
                dockutil --add /Applications/TextEdit.app                      'TextEdit'
                dockutil --add /Applications/Xcode.app                         'Xcode'
                dockutil --add /Applications/Remote\ Desktop.app               'Remote Desktops'
                dockutil --add /Applications/Spotify.app                       'Spotify'
                dockutil --add vnc://M1.local --label 'M1.local' --allhomes
                dockutil --add '~/Downloads' --view grid --display folder --allhomes
                dockutil --add '~/Downloads' --view grid --display folder --allhomes
                dockutil --add '~/Documents' --view grid --display folder --allhomes
                dockutil --add '~/bitcoin'   --view grid --display folder --allhomes
                dockutil --add '~/gui'       --view grid --display folder --allhomes
                dockutil --add '~/dotfiles'  --view grid --display folder --allhomes


                dockutil --remove 'Siri' --allhomes





    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    fi
fi
}
config-dock-prefs
