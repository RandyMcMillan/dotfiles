#!/usr/bin/env bash
HOMEBREW_NO_INSTALL_CLEANUP=false
export  HOMEBREW_NO_INSTALL_CLEANUP

function checkbrew-sudoless () {
    PREFIX=$(brew --prefix)
    export PREFIX

    # take ownership
    sudo mkdir -p $PREFIX/{share/man,bin,lib/node,include/node}
    sudo chown -R $USER $PREFIX/{share/man,bin,sbin,lib/node,include/node}

}

function checkbrew-upgrade() {
if [ "$EUID" -ne "0" ]; then
    if hash brew 2>/dev/null; then
    for item in "${@}"; do
        echo ${item}
        brew upgrade ${FORCE} ${item}
        shift
    done
    fi
fi
}
function checkbrew-cleanup() {
if [ "$EUID" -ne "0" ]; then
    if hash brew 2>/dev/null; then
        brew bundle ${FORCE} cleanup
    fi
fi
}
function checkbrew-uninstall(){

    brew remove --force $(brew list --formula)
    brew remove --cask --force $(brew list)

}
function checkbrew-bundle() {
if [ "$EUID" -ne "0" ]; then
    if hash brew 2>/dev/null; then
        brew bundle ${FORCE} dump
    fi
fi
}
function checkbrew() {
if [ "$EUID" == "0" ]; then
    printf "home brew prevents being installed from root!!!\nTry\nmake adduser-git"
fi
if hash brew 2>/dev/null; then
    export AWK=gawk
    if ! hash $AWK 2>/dev/null; then
        if hash gawk 2>/dev/null; then
            brew unlink gawk
        fi
        brew install $AWK
        brew link $AWK
    fi
    if ! hash git 2>/dev/null; then
        brew install git
    fi
else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    checkbrew
fi
if [[ "$OSTYPE" == "linux"* ]]; then
    if [ "$EUID" -ne "0" ]; then
        SUDO="sudo -s"
    fi
    #CHECK APT
    if [[ "$OSTYPE" == "linux-gnu" ]]; then
        PACKAGE_MANAGER=apt
        export PACKAGE_MANAGER
        INSTALL=install
        export INSTALL
        AWK=gawk
        export AWK
        if hash apt 2>/dev/null; then
            $SUDO $PACKAGE_MANAGER $INSTALL $AWK clang-tools
        fi
    fi
    printf 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/git/.bash_profile
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo
fi
# echo "$OSTYPE"

# Detect Flags and set ENV
for item in "$@"; do
    echo ${item}
    if [[ ${item} == "-v" ]] || [[ ${item} == "--verbose" ]]; then
        VERBOSE="--verbose"
    else
        VERBOSE=
    fi
    if [[ ${item} == "-f" ]] || [[ ${item} == "--force" ]]; then
        FORCE="--force"
    else
        FORCE=""
    fi
    if [[ ${item} == "-s" ]] || [[ ${item} == "--sudo" ]]; then
        SUDO="sudo -s"
    else
        SUDO=""
    fi
    if [[ ${item} == "-h" ]] || [[ ${item} == "--help" ]]; then
        HELP=true
    else
        SUDO=""
    fi


done
# End Detect Flags

#Begin loop
for ((i=1;i<=$#;i++)); do

if [[ -z $2 ]]; then
    checkbrew-help
fi

# positional args first
#--sudo
if [[ ${!i} == "-s" ]] || [[ ${!i} == "--sudo" ]]; then
    if [[ ${1} == "-s" ]] || [[ ${1} == "--sudo" ]]; then
        SUDO="sudo -s"
        export SUDO
        # echo $SUDO
        shift
    else
        checkbrew-help
    fi
fi
#--force
if [[ ${!i} == "-f" ]] || [[ ${!i} == "--force" ]]; then
    if [[ ${1} == "-f" ]] || [[ ${1} == "--force" ]] || \
        [[ ${2} == "-f" ]] || [[ ${2} == "--force" ]]; then
        set FORCE=--force
        export FORCE
        # echo $FORCE
        shift
    fi
fi
#--commands
#--bundle
if [[ ${!i} == "-b" ]] || [[ ${!i} == "--bundle" ]]; then
    # echo "--bundle"
    # TODO: --force detect
    brew bundle ${FORCE} dump
    shift
fi
#--install
if [[ ${!i} == "--install" ]] || [[ ${!i} == "install" ]] || [[ ${!i} == "-i" ]]; then
    echo ${!i}
    #--force
    ((i++))
    if [[ ${!i} == "-f" ]] || [[ ${!i} == "--force" ]]; then
        FORCE=--force
        export FORCE
        echo ${FORCE}
        ((i++))
    fi
    echo ${!i}
    if [[ ${!i} == "--cask" ]]; then
        ((i++))
        brew info --cask ${!i}
        brew install ${FORCE} homebrew/cask/${!i}
    else
        brew info ${!i}
        brew install ${FORCE} ${!i}
    fi
fi
#-uu
if [[ ${!i} == "-uu" ]];then
    brew update
    checkbrew-upgrade

fi
#update
if [[ ${!i} == "-ud" ]] || [[ ${!i} == "update" ]]; then
    shift;
    brew update
fi
if [[ ${!i} == "-ug" ]] || [[ ${!i} == "upgrade" ]]; then
    # shift;
    checkbrew-upgrade
fi
#--info
if [[ ${!i} == "info" ]] || [[ ${!i} == "--info" ]]; then
    firstitem=$1
    shift;
    for item in "${@}"; do
        echo "item = $item"
        brew info $item
    done
fi
#--help
if [[ ${!i} == "-h" ]] || [[ ${!i} == "--help" ]]; then
    HELP=TRUE
    export HELP
    checkbrew-help
else
    HELP=FALSE
    export HELP
    ((i++))
fi

done
# End loop
}

function checkbrew-help(){

echo ""
echo "checkbrew -a --arg    -c    command <item>"
echo ""
echo "checkbrew -s --sudo"
echo "checkbrew -f --force"
echo ""
echo "checkbrew             -h    help"
echo ""
echo "checkbrew             -i    install <brew lib>"
echo ""
echo "checkbrew                   info <brew lib>"
echo ""
echo "checkbrew             -ud   brew update"
echo "checkbrew             -ug   brew upgrade lib"
echo "checkbrew             -uu   brew update & upgrade lib"
echo ""
echo "checkbrew                   update"
echo "checkbrew                   upgrade"
echo "checkbrew                   cleanup"
echo ""
echo "checkbrew                   sudoless"

}
