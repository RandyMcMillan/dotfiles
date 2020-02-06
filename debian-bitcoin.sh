#!/usr/bin/env bash
sudo apt-get -y update
sudo apt-get -y  install git vim
sudo su && echo "sudo mount -t vboxsf -o uid=1000,gid=1000 Share /home/user/vb-share" > /etc/rc.local

