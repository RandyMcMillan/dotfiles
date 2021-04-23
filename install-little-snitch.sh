#!/usr/bin/env bash

if [ ! -d 'LittleSnitch.dmg' ]; then
curl -o LittleSnitch.dmg https://www.obdev.at/ftp/pub/Products/littlesnitch/legacy/LittleSnitch-4.5.2.dmg
fi
if [ -d 'LittleSnitch.dmg' ]; then
open LittleSnitch.dmg
fi
#open /Volumes/Little\ Snitch\ 4.5.2/Little\ Snitch\ Installer.app &

