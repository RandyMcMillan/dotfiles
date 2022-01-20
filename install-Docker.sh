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
        export HOMEBREW_NO_INSTALL_CLEANUP=false
        if ! hash $AWK 2>/dev/null; then
            brew install $AWK
        fi
        if ! hash git 2>/dev/null; then
            brew install git
        fi
        #brew install docker                      || brew install --cask docker             || brew upgrade --cask docker
        #brew install docker-compose              || brew install docker-compose            || brew upgrade docker-compose
        #brew install docker-edge                 || brew install --cask docker-edge || brew upgrade --cask docker-edge
        brew install docker-clean                || brew reinstall docker-clean              || brew upgrade docker-clean
        brew install docker-completion           || brew reinstall docker-completion         || brew upgrade docker-completion
        brew install docker-compose-completion   || brew reinstall docker-compose-completion || brew upgrade docker-compose-completion
        #brew install docker-credential-helper
        #brew install docker-credential-helper-ecr
        #brew install docker-gen
        #brew install docker-ls
        brew install docker-slim                 || brew reinstall docker-slim               || brew upgrade docker-slim
        brew install docker-squash               || brew reinstall docker-squash             || brew upgrade docker-squash
        #brew install docker-swarm                || brew reinstall docker-swarm              || brew upgrade docker-swarm
        brew install docker2aci                  || brew reinstall docker2aci                || brew upgrade docker2aci
        brew install dockerize                   || brew reinstall dockerize                 || brew upgrade dockerize
        brew install lazydocker                  || brew reinstall lazydocker                || brew upgrade lazydocker
        #=====deprecated
        #brew install docker-machine
        #brew install docker-machine-completion
        #brew install docker-machine-driver-hyperkit
        #brew install docker-machine-driver-vmware
        #brew install docker-machine-driver-vultr
        #brew install docker-machine-driver-xhyve
        #brew install docker-machine-nfs
        #brew install docker-machine-parallels
        #brew install docker-toolbox              || brew reinstall docker-toolbox            || brew upgrade docker-toolbox
        #=====deprecated
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
            $PACKAGE_MANAGER $INSTALL $AWK
            #report
        fi
        checkbrew
    fi
    if [[ "$OSTYPE" == "linux-musl" ]]; then
        PACKAGE_MANAGER=apk
        export PACKAGE_MANAGER
        INSTALL=install
        export INSTALL
        AWK=gawk
        export AWK
        if hash apk 2>/dev/null; then
            $PACKAGE_MANAGER $INSTALL $AWK
            #report
        fi
        checkbrew
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
            #report
            # Install some required packages first
            sudo apt update
            sudo apt install -y \
            apt-transport-https \
            ca-certificates \
            curl \
            gnupg2 \
            software-properties-common

            # Get the Docker signing key for packages
            curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -

            # Add the Docker official repos
            echo "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
            $(lsb_release -cs) stable" | \
            sudo tee /etc/apt/sources.list.d/docker.list

            # Install Docker
            sudo apt update
            sudo apt install -y --no-install-recommends \
                docker-ce \
                cgroupfs-mount
            sudo systemctl enable docker
            sudo systemctl start docker
        fi
        checkbrew
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
        #report
        PACKAGE_MANAGER=$(which brew)
        export PACKAGE_MANAGER
        echo $PACKAGE_MANAGER
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

