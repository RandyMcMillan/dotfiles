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
echo "$OS"         | $SUDO awk '{print tolower($0)}'
echo OS_VERSION:
echo "$OS_VERSION" | $SUDO awk '{print tolower($0)}'
echo UNAME_M:
echo "$UNAME_M"    | $SUDO awk '{print tolower($0)}'
echo ARCH:
echo "$ARCH"       | $SUDO awk '{print tolower($0)}'
echo OSTYPE:
echo "$OSTYPE"     | $SUDO awk '{print tolower($0)}'
}

checkbrew() {

    if hash brew 2>/dev/null; then
        brew install awk git docker docker-compose
        echo
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
SUDO=''
if (($EUID != 0)); then
    SUDO='sudo'
    export SUDO
fi
    #CHECK APT
    if [[ "$OSTYPE" == "linux-gnu" ]]; then
        if hash apt 2>/dev/null; then
            $SUDO apt install gawk docker.io docker-compose
            report
            echo 'Using apt...'
        fi
    fi
    if [[ "$OSTYPE" == "linux-musl" ]]; then
        if hash apk 2>/dev/null; then
            $SUDO apk add gawk docker.io docker-compose
            report
            echo 'Using apk...'
        fi
    fi
    if [[ "$OSTYPE" == "linux-arm"* ]]; then
        checkraspi
        if hash apt 2>/dev/null; then
            $SUDO apt install gawk docker.io docker-compose
            report
            echo 'Using apt...'
        fi
    fi
    echo 'https://docs.docker.com/config/daemon/systemd'
    echo 'running $SUDO systemctl start docker'
    $SUDO systemctl start docker
    ##$SUDO apt install $1
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

