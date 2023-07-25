#!/usr/bin/env bash
ARCH=$(uname -m);
export ARCH
echo ARCH=$ARCH

VIM=$(find  /usr/local/bin -name vim)
export VIM
echo   $VIM

MVIM=$(find  /usr/local/bin -name mvim)
export MVIM
echo   $MVIM
MACVIM=$(find  /usr/local/Caskroom -name macvim)
export MACVIM
echo   $MACVIM
MACVIM_APP=$(find  /usr/local/Caskroom -name MacVim.app)
export MACVIM_APP
echo   $MACVIM_APP


if [ hash ssh-agent 2>/dev/null ]; then
    ssh-agent ssh-add
else
    echo "if fail try make config-github"
    echo "if fail try make config-git"
fi
#if [ hash brew 2>/dev/null ]; then
#    brew install git bash llvm
#fi
if [ hash git  2>/dev/null ]; then
    git config --global core.editor vim
fi
if [ hash apt  2>/dev/null ]; then
    apt install git bash
fi
if [ hash apk  2>/dev/null ]; then
    apk add git bash
fi

# VIM=$(find /usr/local/Cellar/macvim -name vim)
# export VIM
# echo   $VIM

install_vim_runtime() {
# brew uninstall  --ignore-dependencies --force ruby perl vim && brew install vim && brew link vim
#WE install this reguardless of OSTYPE
VIMRC_REPO="https://github.com/randymcmillan/vimrc.git"
#export VIMRC_REPO
#echo $VIMRC_REPO
VIMRC_DESTINATION="$HOME/.vim_runtime"
export VIMRC_DESTINATION
rm -rf $VIMRC_DESTINATION
#echo $VIMRC_DESTINATION
make submodules
X86_64HASH=afd92fa75d7b6a103a5d44719e2fbcf4077f1bb4
export X86_64HASH
echo X86_64HASH=$X86_64HASH
git submodule update --init --recursive
#pushd ~/.vim_runtime
#git init && git remote add origin $VIMRC_REPO \
#  git pull -f origin master
#popd
read -t 5 -p "Install .vim_runtime ? (y/n) " -n 1;
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo
	#git submodule update --init --recursive && mv .vim_runtime $VIMRC_DESTINATION || return;
    mv .vim_runtime ~/
    cat .vimrc > /Users/git/.vim_runtime/my_configs.vim
    if [ -d "$VIMRC_DESTINATION" ]; then
        pushd $VIMRC_DESTINATION
        python3 -m pip install --user requests
        if [ ! "$ARCH" = "x86_64" ]; then
            python3 update_plugins.py
        else
            pushd $VIMRC_DESTINATION && git checkout $X86_64HASH
        fi
        sh $VIMRC_DESTINATION/install_awesome_vimrc.sh
        #we exclude from ~/ because we link to here
        popd
    else
        pushd $VIMRC_DESTINATION && git checkout $X86_64HASH
        sh $VIMRC_DESTINATION/install_awesome_vimrc.sh
    fi
fi
}

install_macvim(){
if [[ "$OSTYPE" == "Darwin"* ]]; then
    if hash brew 2>/dev/null; then
        if ! hash mvim 2>/dev/null; then
            read -t 5 -p "Install MacVim? (y/n) " -n 1;
            echo "";
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                rm -f /usr/local/bin/*vi*
                if [ ! hash mvim 2>/dev/null ]; then
                    # brew link --overwrite macvim
                    brew install -f homebrew/cask/macvim
                    brew link --overwrite macvim
                else
                    echo MacVim already installed.
                    echo
                    brew upgrade macvim
                fi
            fi
            if ! hash tccutil 2>/dev/null; then
                brew install tccutil
            fi
            if ! hash dockutil 2>/dev/null; then
                curl -k -o /usr/local/bin/dockutil https://raw.githubusercontent.com/kcrawford/dockutil/master/scripts/dockutil
                chmod a+x /usr/local/bin/dockutil
                dockutil --add $MACVIM --r 'MacVim'
            fi
        fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    fi
fi
which vim
}
install_macvim
install_vim_runtime
