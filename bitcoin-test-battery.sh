#!/usr/bin/env bash
BITCOIN_TEST_BATTERY=bitcoin-test-battery
export BITCOIN_TEST_BATTERY
TIME=$(date +%s)
export TIME
RC=v22.0rc3
export RC

BITCOIN_CONF1="proxy=127.0.0.1:9050 #If you use Windows, this could possibly be 127.0.0.1:9150 in some cases.
listen=1
bind=127.0.0.1
onlynet=onion

connect=ygwcypmb2qiotrp3.onion:8333
connect=stcwaszw352kkjis.onion:8333
connect=nrrmkgmulpgsbwlt.onion
connect=orrxr4kfntzawea3.onion:8333
connect=q2fhnnyt5b2ayvce.onion
connect=rk4vbyca7xnn3top.onion
connect=7ndbwnmgbyupv47f.onion
connect=bitcoinzi27kiwf6.onion
connect=w4ja2rt6wvqn6rfw.onion:8333
connect=6maigxjvcet4pite.onion:8333
connect=cehok4dxukhnoopi.onion:8333
connect=r6apa5ssujxbwd34.onion:8333
connect=ggvnc3v5pmrlsupw.onion:8333
connect=er4mwkhxzxgavrvo.onion:8333
connect=35yncj7et6k3koqy.onion
connect=nesxfmano25clfvn.onion:8333
connect=5d5vtnm6xlsqzq7p.onion
connect=34jtv2p5pw4e5bp3.onion
connect=z5nt64xh4d3vnll2.onion
connect=lncmdma3namzrbnx.onion:8333
connect=lncmdmx7ezlplcck.onion:8333
connect=lncmdmgoddecttey.onion:8444
"

doIt(){


    [[ $(find ~/$BITCOIN_TEST_BATTERY -type d 2>/dev/null) ]] && \
        pushd ~/$BITCOIN_TEST_BATTERY || git clone https://github.com/bitcoin/bitcoin ~/$BITCOIN_TEST_BATTERY

    pushd ~/$BITCOIN_TEST_BATTERY
    git checkout $RC
    cd $BITCOIN_TEST_BATTERY && ./autogen.sh && ./configure --with-gui=yes --with-sqlite=yes --without-bdb && make -j $(nproc --all)
    mkdir -p /tmp/$TIME
    export DATA_DIR=/tmp/$TIME
    mkdir -p $DATA_DIR
    echo $BITCOIN_CONF1 > $DATA_DIR/bitcoin.conf
    export BINARY_PATH=$(pwd)/src
    export QT_PATH=$(pwd)/src/qt
    export BINARY_PATH=$(pwd)/bin
    export QT_PATH=$BINARY_PATH
    #REF: https://github.com/bitcoin-core/bitcoin-devwiki/wiki/22.0-Release-Candidate-Testing-Guide
    #$BINARY_PATH/bitcoin-cli -datadir=$DATA_DIR [cli args]
    # for starting bitcoin-qt
    #$QT_PATH/bitcoin-qt -datadir=$DATA_DIR [cli args]

    #cd ~/BITCOIN_TEST_BATTERY && ./contrib/install_db4.sh .

}

checkbrew() {

    if hash brew 2>/dev/null; then
        brew update
        brew upgrade
        #install brew libs
        brew install wget
        brew install curl
        brew install autoconf automake berkeley-db4 libtool boost miniupnpc pkg-config python qt libevent qrencode
        brew install librsvg
        brew install afl-fuzz codespell shellcheck
    else
        #example - execute script with perl
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        checkbrew
    fi
}
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    checkbrew
    sudo apt install linuxbrew-wrapper
    sudo apt-get install autoconf
    sudo apt-get install libdb4.8++-dev
    sudo apt-get -y install libboost libevent miniupnpc libdb4.8 qt libqrencode univalue libzmq3
    sudo apt-get install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
    sudo apt-get install libevent-dev libboost-system-dev libboost-filesystem-dev libboost-test-dev libboost-thread-dev
    sudo apt-get install libminiupnpc-dev
    sudo apt-get install libzmq3-dev
    sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools
    sudo apt-get install libqrencode-dev

    [[ $(find ~/$BITCOIN_TEST_BATTERY -type d 2>/dev/null) ]] && \
        pushd ~/$BITCOIN_TEST_BATTERY || git clone https://github.com/bitcoin/bitcoin ~/$BITCOIN_TEST_BATTERY

    pushd ~/$BITCOIN_TEST_BATTERY
    git checkout $RC
    cd $BITCOIN_TEST_BATTERY && ./autogen.sh && ./configure --with-gui=yes --with-sqlite=yes --without-bdb && make -j $(nproc --all)
    mkdir -p /tmp/$TIME
    export DATA_DIR=/tmp/$TIME
    mkdir -p $DATA_DIR
    echo $BITCOIN_CONF1 > $DATA_DIR/bitcoin.conf
    export BINARY_PATH=$(pwd)/src
    export QT_PATH=$(pwd)/src/qt
    export BINARY_PATH=$(pwd)/bin
    export QT_PATH=$BINARY_PATH
    #REF: https://github.com/bitcoin-core/bitcoin-devwiki/wiki/22.0-Release-Candidate-Testing-Guide
    #$BINARY_PATH/bitcoin-cli -datadir=$DATA_DIR [cli args]
    # for starting bitcoin-qt
    #$QT_PATH/bitcoin-qt -datadir=$DATA_DIR [cli args]


    #cd ~/BITCOIN_TEST_BATTERY && ./contrib/install_db4.sh .



elif [[ "$OSTYPE" == "darwin"* ]]; then
    checkbrew
    git clone https://github.com/randymcmillan/bitcoin ~/bitcoin
    cd ~/bitcoin && ./contrib/install_db4.sh .
    ./autogen.sh && ./configure --disable-wallet --disable-tests --disable-bench && make appbundle

    git clone https://github.com/randymcmillan/gui ~/gui
    cd ~/gui && ./contrib/install_db4.sh .
    ./autogen.sh && ./configure --disable-wallet --disable-tests --disable-bench && make appbundle

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



