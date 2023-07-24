#!/usr/bin/env bash
VERSION=11.2

defaults delete  com.apple.dt.Xcode DVTPlugInManagerNonApplePlugIns-Xcode-$VERSION

git clone git clone https://github.com/XVimProject/XVim2.git ~/XVim2
cd ~/XVim2
git checkout xcode$VERSION
make

mkdir -p ~/Library/Application\ Support/Developer/Shared/Xcode/Plug-ins/

ln -s ~/XVim2/build/Release/XVim2.xcplugin  ~/Library/Application\ Support/Developer/Shared/Xcode/Plug-ins/
