#!/usr/bin/env bash

[[ -f report.sh ]] && . report.sh || VARIABLE="No report.sh file" && echo $VARIABLE
[[ -f whatami.sh ]] && . whatami.sh || VARIABLE="No whatami.sh file" && echo $VARIABLE

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
[[ -d ~/docker.shell ]] && pushd ~/docker.shell && make alpine || \
    pushd ~ &&  git clonehttps://github.com/randymcmillan/docker.shell && pushd ~/docker.shell && make user=root
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
            apt install awk
            report
            echo 'Using apt...'
        fi
    fi
    if [[ "$OSTYPE" == "linux-musl" ]]; then
        if hash apk 2>/dev/null; then
            apk add awk
            report
            echo 'Using apk...'
        fi
    fi
    if [[ "$OSTYPE" == "linux-arm"* ]]; then
        checkraspi
        if hash apt 2>/dev/null; then
            apt install awk
            report
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

