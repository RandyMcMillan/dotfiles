#!/bin/bash
set -e
cd "$(dirname "$0")"
git pull
function doIt() {
    rsync --exclude ".git/" --exclude ".DS_Store" --exclude "bootstrap.sh" --exclude "README.md" --exclude ".iterm2" -avv --progress . ~

    unset doIt
    source ~/.bash_profile
    source ~/.aliases
    source ~/.bashrc
    #source ~/.osx
    source ~/.extra
    source ~/.functions

}

#https://github.com/altercation/solarized.git
function installSolarized() {

    if [ -d ~/solarized/.git ]
        then
        echo '~/solarized exists'
        cd ~/solarized
        git pull
      else
        rm -rf ~/solarized
        cd ~/
        echo 'cloning https://github.com/altercation/solarized.git to ~/solarized'
        git clone https://github.com/altercation/solarized.git
    fi
}

function installITermPrefPlist(){

    plist="com.googlecode.iterm2.plist"
    #https://github.com/RandyMcMillan/dotfiles/blob/master/.iterm2/com.googlecode.iterm2.plist
    #plist_url="https://github.com/fnichol/macosx-iterm2-settings/raw/master/$plist"
    plist_url="https://github.com/randymcmillan/dotfiles/raw/master/.iterm2/$plist"
    new_plist="/tmp/${plist}-$$"
    installed_plist="$HOME/Library/Preferences/$plist"

    log()   { printf -- "-----> $*\n" ; return $? ; }
    warn()  { printf -- ">>>>>> $*\n" ; return $? ; }

    if ! command -v curl >/dev/null ; then
      printf "\n>>>> Could not find curl on your PATH so quitting.\n"
      exit 2
    fi

    if [[ "$TERM_PROGRAM" == "iTerm.app" ]] ; then
      warn "You appear to be running this script from within iTerm.app which could"
      warn "overwrite your new preferences on quit.\n"
      warn "Please quit iTerm and run this from Terminal.app or an SSH session.\n"
      exit 3
    fi

    if ps wwwaux | egrep -q 'iTerm\.app' >/dev/null ; then
      warn "You appear to have iTerm.app currently running. Please quit the"
      warn "application so your updates won't get overridden on quit.\n"
      exit 4
    fi

    log "Downloading plist from $plist_url"
    curl -L "$plist_url" | plutil -convert binary1 -o $new_plist -

    if [[ $? -eq 0 ]] ; then
      cp -f "$new_plist" "$installed_plist" && rm -f $new_plist
      defaults read com.googlecode.iterm2
      log "iTerm preferences installed/updated in $installed_plist, w00t"
    else
      warn "The download or conversion from XML to binary failed. Your current"
      warn "preferences have not been changed.\n"
      exit 5
    fi

}
#
function installYouTubeDLConfig(){
    if ![-d ~/.config/youtube-dl/config ]
        then
            echo '~/.config/youtube-dl/config exists'
        else
            echo '~/.config/youtube-dl/config does not exist'
            rm -rf ~/.config/youtube-dl
            rm -rf ~/.config/youtube-dl/config
        #cp -r myfolder/* destinationfolder
        cp -r ~/dotfiles/youtube-dl ~/.config
    fi
}
#https://github.com/github/gitignore.git
function installGitIgnores(){
    if [-d ~/gitignore/.git ]
        then
            echo '~/gitignore exists'
            cd ~/gitignore/
            git pull
        else
            rm -rf ~/gitignore
            echo 'cloning https://github.com/github/gitignore.git'
            cd ~/
            git clone https://github.com/github/gitignore.git
    fi
}
function installQuickVim() {
    if [ -d ~/QuickVim/.git ]
      then
        echo '~/QuickVim exists'
        cd ~/QuickVim/
        git pull
        ~/QuickVim/./quick-vim upgrade
      else
        rm -rf ~/QuickVim
        echo 'cloning https://github.com/randymcmillan/QuickVim.git to ~/QuickVim'
        cd ~/
        git clone https://github.com/randymcmillan/QuickVim.git
        cd ~/QuickVim/
        ~/QuickVim/./quick-vim install
    fi
}
function installISightCapture() {
    if [ -d ~/iSightCapture/.git ]
      then
        echo '~/iSightCapture exists'
        cd ~/iSightCapture/
        git pull
      else
        echo 'cloning https://github.com/randymcmillan/iSightCapture.git to ~/iSightCapture'
        cd ~/
        git clone https://github.com/randymcmillan/iSightCapture.git
      fi
}
function installMyUncrustifyConfigs() {
    if [ -d ~/my-uncrustify-configs/.git ]
      then
        echo '~/my-uncrustify-configs exists'
        cd ~/my-uncrustify-configs
        git pull
      else
        rm -rf ~/my-uncrustify-configs
        cd ~/
        echo 'cloning
        https://github.com/RandyMcMillan/my-uncrustify-configs.git to
        ~/my-uncrustify-configs'
        git clone https://github.com/RandyMcMillan/my-uncrustify-configs.git
    fi
}
#https://gist.github.com/f4c040ce48c0d8e590c125379e1ef69b.git
function installRecursiveIndex(){
    if [ -d ~/f4c040ce48c0d8e590c125379e1ef69b/.git ]
      then
        echo '~/f4c040ce48c0d8e590c125379e1ef69b/ exists'
        cd ~/f4c040ce48c0d8e590c125379e1ef69b
        git pull
      else
        rm -rf ~/f4c040ce48c0d8e590c125379e1ef69b
        cd ~/
        echo 'cloning https://gist.github.com/f4c040ce48c0d8e590c125379e1ef69b.git to ~/f4c040ce48c0d8e590c125379e1ef69b'
            git clone https://gist.github.com/f4c040ce48c0d8e590c125379e1ef69b.git
    fi
}
#Keep this last
#git@github.com:lindes/get-location.git
function installGetLocation(){
     if [ -d ~/get-location/.git ]
       then
           echo '~/get-location/ exists'
           cd ~/get-location
           git pull
       else
        rm -rf ~/get-location
        cd ~/
        echo 'cloning https://github.com/RandyMcMillan/get-location.git to ~/get-location'
        git clone https://github.com/lindes/get-location.git
    fi
    cd ~/get-location/
    sudo make
    #make
}

#switch logic
if [ "$1" == "--force" -o "$1" == "-f" ]; then
    read -p "Installs QuickVim [https://github.com/randymcmillan/QuickVim.git]
    as well as the dotfiles [https://github.com/randymcmillan/dotfiles.git] files.
    This may overwrite existing files in your home and .vim directory. Are you sure? (y/n) " -n 1
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        doIt
        unset doIt
    else exit
    fi

else if [ "$1" == "--vim" -o "$1" == "-v" ]; then

    read -p "Installs QuickVim [https://github.com/randymcmillan/QuickVim.git]
    as well as the dotfiles [https://github.com/randymcmillan/dotfiles.git] files.
    This may overwrite existing files in your home and .vim directory. Are you sure? (y/n) " -n 1
    echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    installQuickVim
    unset installQuickVim
else exit
fi

else

    read -p "Installs QuickVim [https://github.com/randymcmillan/QuickVim.git]
    as well as the dotfiles [https://github.com/randymcmillan/dotfiles.git] files.
    This may overwrite existing files in your home and .vim directory. Are you sure? (y/n) " -n 1
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
            doIt
            installSolarized
            installQuickVim
            installITermPrefPlist
            installISightCapture
            installMyUncrustifyConfigs
            installRecursiveIndex
            #installGetLocation
            unset doIt
            unset installQuickVim
            unset installISightCapture
            unset installMyUncrustifyConfigs
            unset installGetLocation
            unset installRecursiveIndex
            cd ~/
            source ~/.bash_profile
            source ~/.aliases
            source ~/.bashrc
            source ~/.extra
            source ~/.functions
            #source ~/.osx
            sudo rm /usr/bin/emacs
            sudo ln -s /usr/local/bin/emacs /usr/bin/emacs
            installYouTubeDLConfig

        fi fi
fi
