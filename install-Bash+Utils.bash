#!/usr/bin/env bash
addPath() {
    echo "Adding $1 to PATH";
    chmod +x $1
    export PATH="$PATH:$1";
}
export -f addPath

install-bash-infinity() {
mkdir -p /usr/local/bin

if [ ! -d "${BASH_SOURCE[0]%/*}"/bin/bash-oo-framework ]; then \
    git clone https://github.com/niieani/bash-oo-framework.git bin/bash-oo-framework
fi
source "$( cd "${BASH_SOURCE[0]%/*}" && pwd )/bin/bash-oo-framework/lib/oo-bootstrap.sh"
# load the type system
source "$( cd "${BASH_SOURCE[0]%/*}" && pwd )/bin/bash-oo-framework/lib/util/log.sh"
source "$( cd "${BASH_SOURCE[0]%/*}" && pwd )/bin/bash-oo-framework/lib/util/exception.sh"
source "$( cd "${BASH_SOURCE[0]%/*}" && pwd )/bin/bash-oo-framework/lib/util/tryCatch.sh"
source "$( cd "${BASH_SOURCE[0]%/*}" && pwd )/bin/bash-oo-framework/lib/util/namedParameters.sh"
#import util/log util/exception util/tryCatch util/namedParameters

# load the standard library for basic types and type the system
#import util/class



}

install-bash() {

    if hash brew 2>/dev/null; then
        if ! hash bash 2>/dev/null; then
                brew install bash
            if ! hash bash-completion 2>/dev/null; then
                brew install bash-completion
            fi
        fi
    else

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        install-bash

    fi
}
install-bash
install-bash-infinity
