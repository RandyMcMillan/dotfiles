#!/usr/bin/env bash

adduser-git() {

adduser git
usermod -aG sudo git

su - git

}
#adduser-git

#!/usr/bin/env bash

#[[ -f report.sh ]] && . report.sh || VARIABLE="No report.sh file" && echo $VARIABLE
#[[ -f whatami.sh ]] && . whatami.sh || VARIABLE="No whatami.sh file" && echo $VARIABLE


#source "$( cd "${BASH_SOURCE[0]%/*}" && pwd )/bin/bash-oo-framework/lib/oo-bootstrap.sh"
#
## load the type system
#import util/log util/exception util/tryCatch util/namedParameters
#import util/variable
#
## using colors:
#echo "$(UI.Color.Blue)I'm blue...$(UI.Color.Default)"
#
## enable basic logging for this file by declaring a namespace
#namespace myApp
## make the Log method direct everything in the namespace 'myApp' to the log handler called DEBUG
#Log::AddOutput myApp DEBUG
#
## now we can write with the DEBUG output set
#Log "Play me some Jazz, will ya? $(UI.Powerline.Saxophone)"
#
## redirect error messages to STDERR
#Log::AddOutput error STDERR
#subject=error Log "test error log"
#
## reset outputs
##Log::ResetAllOutputsAndFilters
#
## You may also hardcode the use for the StdErr output directly:
##Console::WriteStdErr "This will be printed to STDERR, no matter what."
#
#try {
#    # something...
#    rm -rf ~/test
#    touch ~/test
#    cp ~/test ~/test2
#    # something more...
#} catch {
#    echo "The hard disk is not connected properly!"
#    echo "Caught Exception:$(UI.Color.Red) $__BACKTRACE_COMMAND__ $(UI.Color.Default)"
#    echo "File: $__BACKTRACE_SOURCE__, Line: $__BACKTRACE_LINE__"
#
#    ## printing a caught exception couldn't be simpler, as it's stored in "${__EXCEPTION__[@]}"
#    Exception::PrintException "${__EXCEPTION__[@]}"
#}

checkbrew() {
    if hash brew 2>/dev/null; then
        if !hash $AWK 2>/dev/null; then
            brew install $AWK
        fi
        if !hash git 2>/dev/null; then
            brew install git
        fi
        brew reinstall $FORCE bash
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
checkraspi(){
    echo 'Checking Raspi'
    if [ -e /etc/rpi-issue ]; then
    echo "- Original Installation"
    cat /etc/rpi-issue
    fi
    if [ -e /usr/bin/lsb_release ]; then
    echo "- Current OS"
    lsb_release -irdc
    fi
    echo "- Kernel"
    uname -r
    echo "- Model"
    cat /proc/device-tree/model && echo
    echo "- hostname"
    hostname
    echo "- Firmware"
    /opt/vc/bin/vcgencmd version
}
if [[ "$OSTYPE" == "linux"* ]]; then
    #CHECK APT
    if [[ "$OSTYPE" == "linux-gnu" ]]; then
        PACKAGE_MANAGER=apt
        export PACKAGE_MANAGER
        INSTALL=install
        export INSTALL
        AWK=gawk
        export AWK
        if hash apt 2>/dev/null; then
        if hash adduser 2>/dev/null; then
            $PACKAGE_MANAGER $INSTALL $AWK
            adduser-git
        else
            apt adduser
        fi
        fi
    fi
    if [[ "$OSTYPE" == "linux-musl" ]]; then
        PACKAGE_MANAGER=apk
        export PACKAGE_MANAGER
        INSTALL=add
        export INSTALL
        AWK=gawk
        export AWK
        if hash apk 2>/dev/null; then
            $PACKAGE_MANAGER $INSTALL $AWK
        fi
    fi
    if [[ "$OSTYPE" == "linux-arm"* ]]; then
        PACKAGE_MANAGER=apt
        export PACKAGE_MANAGER
        INSTALL=install
        export INSTALL
        AWK=gawk
        echo $AWK
        export AWK
        checkraspi
        if hash apt 2>/dev/null; then
            $PACKAGE_MANAGER $INSTALL $AWK
        fi
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
        PACKAGE_MANAGER=brew
        export PACKAGE_MANAGER
        INSTALL=install
        export INSTALL
        AWK=awk
        export AWK
        checkbrew
elif [[ "$OSTYPE" == "cygwin" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "msys" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "win32" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "freebsd"* ]]; then
    echo TODO add support for $OSTYPE
else
    echo TODO add support for $OSTYPE
fi

