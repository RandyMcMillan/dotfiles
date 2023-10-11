#!/usr/bin/env bash

VMWARE=$(find /usr/local/Cellar/ -name VMware\ Fusion.app)
export VMWARE
echo   $VMWARE

checkbrew() {
if hash brew 2>/dev/null; then
    brew install --cask vmware-fusion11
else
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    checkbrew
fi
}
read -t 1 -p "Install VMWare Fusion? (y/n) " -n 1;
echo "";
if [[ $REPLY =~ ^[Yy]$ ]]; then
checkbrew
fi
