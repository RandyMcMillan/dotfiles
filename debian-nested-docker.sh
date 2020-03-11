#!/usr/bin/env bash
#REF: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-debian-9
sudo apt-get -y update
sudo apt-get -y  install git vim
sudo apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
sudo usermod -aG docker ${USER}
#
#
#To apply the new group membership, log out of the server and back in, or type the following:
#su - ${USER}
#id -nG

#we need to get some gpg keys onto the vm without a bunch of ssh piping
mkdir ~/vb-share
sudo su && echo "sudo mount -t vboxsf -o uid=1000,gid=1000 Share /home/git/vb-share" > /etc/rc.local

