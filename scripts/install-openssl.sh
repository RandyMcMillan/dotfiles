#!/usr/bin/env bash
checkbrew() {

    if hash brew 2>/dev/null; then
        brew install openssl@1.1
        brew install openssl@3
        brew install glib-openssl
        true
    else
        #We install homebrew if not exist
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
setup(){
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    if hash apt 2>/dev/null; then
        sudo apt-get update
        sudo apt-get install  libssl-dev
    fi
    true #checkbrew linuxbrew acting weird in travis-ci
elif [[ "$OSTYPE" == "darwin"* ]]; then

#   Warning: Refusing to link macOS provided/shadowed software: openssl@3
#   If you need to have openssl@3 first in your PATH, run:
    echo 'export PATH="/usr/local/opt/openssl@1.1/bin:$PATH"' >> /Users/git/.bash_profile
    echo 'export PATH="/usr/local/opt/openssl@3/bin:$PATH"' >> /Users/git/.bash_profile

#   For compilers to find openssl@3 you may need to set:
    export LDFLAGS="-L/usr/local/opt/openssl@1.1/lib"
    export LDFLAGS="-L/usr/local/opt/openssl@3/lib"
    export CPPFLAGS="-I/usr/local/opt/openssl@1.1/include"
    export CPPFLAGS="-I/usr/local/opt/openssl@3/include"

#   For pkg-config to find openssl@3 you may need to set:
    export PKG_CONFIG_PATH="/usr/local/opt/openssl@1.1/lib/pkgconfig"
    export PKG_CONFIG_PATH="/usr/local/opt/openssl@3/lib/pkgconfig"

#
#    which openssl
#    checkbrew
#    #symlink on your machine too...
#    echo brew list --versions
#    brew list --versions
#    echo
    OPENSSL_VERSION_v1=$(brew list --versions | grep -i -E  "openssl" | sed 's%openssl@1.1% %')
    OPENSSL_VERSION_v3=$(brew list --versions | grep -i -E  "openssl" | sed 's%openssl@3% %')
    export OPENSSL_VERSION_v1
    echo $OPENSSL_VERSION_v1
    export OPENSSL_VERSION_v3
    echo $OPENSSL_VERSION_v3
#    echo openssl version
#    echo $OPENSSL_VERSION_v1
#    echo $OPENSSL_VERSION_v3
#    export OPENSSL_VERSION_v1
#    export OPENSSL_VERSION_v3
#    echo using $OPENSSL_VERSION_v3
    OPENSSL_VERSION=OPENSSL_VERSION_v3
    export OPENSSL_VERSION
#    echo "OPENSSL_VERSION = $OPENSSL_VERSION"
    sudo mkdir -p /usr/local/include/openssl/$OPENSSL_VERSION
#    sudo rm -rf /usr/local/include/openssl/$OPENSSL_VERSION
#    sudo ln -s /usr/local/opt/openssl/include/openssl /usr/local/include/openssl/$OPENSSL_VERSION
#    #sudo rm -rf /usr/bin/openssl
#    #sudo ln -s /usr/local/Cellar/openssl/$OPENSSL_VERSION/include/openssl    /usr/bin/openssl
    sudo rm -rf /usr/local/bin/openssl
    sudo ln -s /usr/local/Cellar/openssl/$OPENSSL_VERSION/include/openssl    /usr/local/bin/openssl
    sudo rm -f /usr/local/lib/libssl.*.*.dylib
    sudo rm -f /usr/local/lib/libcrypto.*.*.dylib
    sudo rm -f /usr/local/lib/libcrypto.a
    sudo rm -f /usr/local/lib/libcrypto.*.*.a
    ln -s /usr/local/opt/openssl/lib/libssl.1.1.dylib                   /usr/local/lib/libssl.1.1.dylib
    ln -s /usr/local/opt/openssl/lib/libcrypto.1.1.dylib                /usr/local/lib/libcrypto.1.1.dylib
    ln -s /usr/local/opt/openssl/lib/libcrypto.a                        /usr/local/lib/libcrypto.a
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
}
checkbrew
setup
