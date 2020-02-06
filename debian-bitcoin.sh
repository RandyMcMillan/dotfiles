#!/usr/bin/env bash
sudo apt-get -y update
sudo apt-get -y  install git vim

#we need to get some gpg keys onto the vm without a bunch of ssh piping
mkdir ~/vb-share
sudo su && echo "sudo mount -t vboxsf -o uid=1000,gid=1000 Share /home/git/vb-share" > /etc/rc.local

