#!/usr/bin/env bash

adduser-git() {
USER_NAME=git
cat /etc/passwd | grep ${USER_NAME} >/dev/null 2>&1
if [ $? -eq 0 ] ; then
    echo "User Exists"
    su - ${USER_NAME}
else
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

    adduser git
    usermod -aG sudo git

    fi

fi
}
