#!/usr/bin/env bash -xv
checkbrew() {

    if hash brew 2>/dev/null; then
        brew install openssl@1.1
        true
    else
        #We install homebrew if not exist
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    if hash apt 2>/dev/null; then
        sudo apt-get update
        sudo apt-get install  libssl-dev
    fi
    true #checkbrew linuxbrew acting weird in travis-ci
elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew
    #symlink on your machine too...
    OPENSSL_VERSION=$(brew list --versions | grep -i -E  "openssl" | sed 's%openssl@1.1% %')
    echo openssl version
    echo $OPENSSL_VERSION
    export OPENSSL_VERSION
    rm -rf /usr/local/include/openssl
    mkdir -p /usr/local/include/openssl/$OPENSSL_VERSION
    install -v /usr/local/opt/openssl/include/openssl/*                      /usr/local/include/openssl/$OPENSSL_VERSION
    install -v /usr/local/Cellar/openssl/$OPENSSL_VERSION/include/openssl    /usr/bin/openssl
    install -v /usr/local/Cellar/openssl/$OPENSSL_VERSION/include/openssl    /usr/local/bin/openssl
    install -v /usr/local/opt/openssl/lib/libssl.1.1.dylib                   /usr/local/lib/
    install -v /usr/local/opt/openssl/lib/libcrypto.1.1.dylib                /usr/local/lib/
    install -v /usr/local/opt/openssl/lib/libcrypto.a                        /usr/local/lib/
    which openssl

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
