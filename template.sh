#!/usr/bin/env bash
HOMEBREW_NO_INSTALL_CLEANUP=false
export  HOMEBREW_NO_INSTALL_CLEANUP

function brew-sudoless () {
    PREFIX=$(brew --prefix)
    export PREFIX

    # take ownership
    sudo mkdir -p $PREFIX/{share/man,bin,lib/node,include/node}
    sudo chown -R $USER $PREFIX/{share/man,bin,sbin,lib/node,include/node}

}

function brew-update() {
u
if [ "$EUID" -ne "0" ]; then
    if hash brew 2>/dev/null; then
        brew update
    fi
fi
}
function brew-upgrade() {
if [ "$EUID" -ne "0" ]; then
    if hash brew 2>/dev/null; then
        brew upgrade
    fi
fi
}
function brew-cleanup() {
if [ "$EUID" -ne "0" ]; then
    if hash brew 2>/dev/null; then
        brew bundle ${FORCE} cleanup
    fi
fi
}
function brew-uninstall(){

    brew remove --force $(brew list --formula)
    brew remove --cask --force $(brew list)

}
function brew-bundle() {
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

for ((i=1;i<=$#;i++));
do

if [[ -z ${1} ]]; then
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
        FORCE=--force
        export FORCE
        # echo $FORCE
        shift
    fi
fi
#--commands
#--bundle
if [[ ${!i} == "-b" ]] || [[ ${!i} == "--bundle" ]]; then
    # echo "--bundle"
    brew bundle ${FORCE} dump
    shift
fi
#--install
if [[ ${!i} == "--install" ]]; then
    # echo "--install ${FORCE} ${!i}"
    # ((i++))
    shift
    # echo "--install ${FORCE} ${!i}"
    # brew install ${FORCE} ${!i}
    # libs=( "${@}"  )
    for item in "$@"; do
    # for item in "$libs"; do
        brew install ${FORCE} ${item}
        shift
    done


fi
#--info
if [[ ${!i} == "-i" ]] || [[ ${!i} == "--info" ]] || \
    [[ ${!i} == "-h" ]] || [[ ${!i} == "--help" ]]; then
    firstitem=$1
    shift;
    for item in "${@}"; do
        echo "item = $item"
        #process item
    done
    checkbrew-help
else
# last if/then needs to increment
((i++))
fi

done
}


# if [[ ${!i} == "-f" ]]; then
#     FORCE=--force
#     export FORCE
#     shift
#     checkbrew-info
# fi
# if [[ ${!i} == "sudoless"* ]]; then
#     brew-sudoless
#     echo "brew in now sudoless!!!"
# fi
# if [[ ${!i} == "install" ]]; then
#     ((i++))
#     if [[ ${!i} = cask ]]; then
#         ((i++))
#         for item in "${@:2}"
#         do
#             echo "installing $item..."
#             brew install ${FORCE} "${!item}"
#         done
#     fi
#     for item in "${@:2}"
#     do
#         brew install ${FORCE} "${!i}"
#     done
#     brew install ${FORCE} "${!i}"
#     brew install ${FORCE} "${!i}"
# fi
# if [[ ${!i} == "reinstall" ]]; then
#     ((i++))
#     brew reinstall ${FORCE} "${2}"
# fi
# if [[ ${!i} = uninstall ]]; then
#     ((i++))
#     brew-uninstall
# fi
# if [[ ${!i} = check* ]]; then
#     ((i++))
#     checkbrew
# fi
# if [[ ${!i} = "update"* ]]; then
#     ((i++))
#     brew-update
# fi
# if [[ ${!i} = "upgrade"* ]]; then
#     ((i++))
#     brew-upgrade
# fi
# if [[ ${!i} = "cleanup"* ]]; then
#     ((i++))
#     brew-cleanup
# fi
# if [[ ${!i} = "bundle"* ]]; then
#     ((i++))
#     brew bundle ${FORCE} dump
# else
# echo "try:\ncheckbrew-help"
# fi
# done
# }
function checkbrew-help(){

echo ""
echo "checkbrew -a --arg    -c    --command <item>"
echo ""
echo "checkbrew -s --sudo"
echo "checkbrew -f --force"
echo "checkbrew             -i    --info"
echo "checkbrew             -h    --help"
echo "checkbrew             -u    --update & upgrade"
echo ""
echo "checkbrew             -ud   --update"
echo "checkbrew             -ug   --upgrade"
echo "checkbrew             -cu   --cleanup"
echo ""
echo "checkbrew             -sl   --sudoless"

}
