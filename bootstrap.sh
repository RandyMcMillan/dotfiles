#!/bin/bash
set -e
cd "$(dirname "$0")"
git pull
function doIt() {
	rsync --exclude ".git/" --exclude ".DS_Store" --exclude "bootstrap.sh" --exclude "README.md" -avv --progress . ~
}
function installQuickVim() {
            if [ -d ~/QuickVim ]
                    then
                            echo '~/QuickVim exists'
                            cd ~/QuickVim/
                             ~/QuickVim/./quick-vim upgrade
                    else
                            echo 'cloning https://github.com/randymcmillan/QuickVim.git to ~/QuickVim'
                            git clone https://github.com/randymcmillan/QuickVim.git ~/QuickVim
                            cd ~/QuickVim/
                            ~/QuickVim/./quick-vim install


                    fi
}
function installISightCapture() {
            if [ -d ~/iSightCapture ]
                    then
                            echo '~/iSightCapture exists'
                            cd ~/iSightCapture/
                            git pull
                    else
                            echo 'cloning
                            https://github.com/randymcmillan/iSightCapture.git
                            to ~/iSIghtCapture'
                            git clone
                            https://github.com/randymcmillan/iSightCapture.git ~/iSightCapture
                            cd ~/iSightCapture/
                            installISightCapture
                    fi
}
function installMyUncrustifyConfigs() {
            if [ -d ~/my-uncrustify-configs ]
                then
                    echo '~/my-uncrustify-configs'
                    cd ~/my-uncrustify-configs
                    git pull
                else
                    echo 'cloning
                    https://github.com/RandyMcMillan/my-uncrustify-configs.git to
                    ~/my-uncrustify-configs'
                    git clone https://github.com/RandyMcMillan/my-uncrustify-configs.git
                    ~/my-uncrustofy-configs
                    installMyUncrustofyConfigs
            fi
}
if [ "$1" == "--force" -o "$1" == "-f" ]; then
	doIt
else
	read -p "Installs QuickVim [https://github.com/randymcmillan/QuickVim.git] 
    as well as the dotfiles [https://github.com/randymcmillan/dotfiles.git] files.
    This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1
	echo
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		doIt
        installQuickVim
        installISightCapture
        installMyUncrustifyConfigs
#    fi
unset doIt
unset installQuickVim
unset installISightCapture
unset installMyUncrustifyConfigs
cd ~/
source ~/.bash_profile
source ~/.aliases
    fi
fi
