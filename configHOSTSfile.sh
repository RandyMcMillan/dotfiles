#!/usr/bin/env bash

configHOSTSfile() {

#REF:https://github.com/StevenBlack/hosts.git
echo 'configHOSTSfile'
    read -p "Config hosts file? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git clone --depth 1 https://github.com/randymcmillan/hosts.git
        cd hosts && python3 -m pip install --user -r requirements.txt
        python3 testUpdateHostsFile.py
        python3 updateHostsFile.py -a -r -e fakenews gambling porn social
    fi

}
configHOSTSfile
