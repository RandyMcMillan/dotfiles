#!/usr/bin/env bash
HOMEBREW_NO_INSTALL_CLEANUP=fale
export  HOMEBREW_NO_INSTALL_CLEANUP

function install-cirrus() {
    if hash brew 2>/dev/null; then
        echo brew exists!
        if ! hash cirrus 2>/dev/null; then
            if [ "$EUID" -ne 0 ]; then
                brew install cirruslabs/cli/cirrus || \
                    curl -L -o cirrus https://github.com/cirruslabs/cirrus-cli/releases/latest/download/cirrus-$(uname | tr '[:upper:]' '[:lower:]')-amd64 \
                    && sudo mv cirrus /usr/local/bin/cirrus && sudo chmod +x /usr/local/bin/cirrus
            else
                echo "try: make adduser-git"
                echo "then install cirrus in the git user profile!"
            fi
        else
            echo cirrus exists!
            echo "try: brew reinstall --force cirrus"
            echo "or:  brew reinstall --force cirruslabs/cli/cirrus"
        fi
    else
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
