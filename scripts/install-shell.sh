#!/usr/bin/env bash
#ENV VARS
OS=$(uname)
OS_VERSION=$(uname -r)
UNAME_M=$(uname -m)
ARCH=$(uname -m)
export OS
export OS_VERSION
export UNAME_M
export ARCH

report() {
echo OS:
echo "$OS" | awk '{print tolower($0)}'
echo OS_VERSION:
echo "$OS_VERSION" | awk '{print tolower($0)}'
echo UNAME_M:
echo "$UNAME_M" | awk '{print tolower($0)}'
echo ARCH:
echo "$ARCH" | awk '{print tolower($0)}'
echo OSTYPE:
echo "$OSTYPE" | awk '{print tolower($0)}'
}

checkbrew() {

    if hash brew 2>/dev/null; then
        if !hash docker 2>/dev/null; then
            if !hash docker-compose 2>/dev/null; then
                if !hash awk 2>/dev/null; then
                    brew install awk
                fi
                if !hash git 2>/dev/null; then
                    brew install git
                fi
	    brew install docker docker-compose
                echo
            fi
        fi
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
        if hash apt 2>/dev/null; then
            apt install gawk
            #report
            echo 'Using apt...'
        fi
    fi
    if [[ "$OSTYPE" == "linux-musl" ]]; then
        if hash apk 2>/dev/null; then
            apk add awk
            #report
            echo 'Using apk...'
        fi
    fi
    if [[ "$OSTYPE" == "linux-arm"* ]]; then
        checkraspi
        if hash apt 2>/dev/null; then
            apt install awk
            #report
            echo 'Using apt...'
        fi
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
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


/Applications/Docker.app/Contents/MacOS/Docker\ Desktop.app/Contents/MacOS/Docker\ Desktop &
exec bash

test $HOME/docker.shell && pushd $HOME/docker.shell || git clone http://github.com/randymcmillan/docker.shell.git $HOME/docker.shell \
    && pushd $HOME/docker.shell && make $1 user=root

