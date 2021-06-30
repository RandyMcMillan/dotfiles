#!/usr/bin/env bash
#
checkbrew() {

    if hash brew 2>/dev/null; then
        #brew install tor tor-browser
        #open https://orangepill.blog/bitcoin/2020/12/14/connect-specter-desktop-on-mac-os-to-your-raspiblitz.html
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    echo

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

