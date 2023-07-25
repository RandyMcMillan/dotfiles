#!/usr/bin/env bash

#Some file permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 644 ~/.ssh/authorized_keys
touch ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts
touch ~/.ssh/config
chmod 644 ~/.ssh/config

#For unique key naming
DATE=$(date +%s)
export DATA
#Primary keys
ID_RSA=~/.ssh/$DATE.id_rsa
export ID_RSA
GITHUB_RSA=~/.ssh/$DATE.github_rsa
export GITHUB_RSA
MOZILLA_RSA=~/.ssh/$DATE.mozilla_rsa
export MOZILLA_RSA

#Start ssh-agent
eval "$(ssh-agent -s)"

#Generate Keys with $DATE prefix
#Create first incase primary keys not exist
ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f $ID_RSA
ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f $GITHUB_RSA
ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f $MOZILLA_RSA

ssh-add $ID_RSA
ssh-add $GITHUB_RSA
ssh-add $MOZILLA_RSA

#Some more file permissions
#for Primary keys and prefixed keys
chmod 600 $ID_RSA
chmod 644 $ID_RSA.pub

chmod 600 $GITHUB_RSA
chmod 644 $GITHUB_RSA.pub

chmod 600 $MOZILLA_RSA
chmod 644 $MOZILLA_RSA.pub

echo
echo $ID_RSA.pub
cat $ID_RSA.pub
echo
echo $GITHUB_RSA.pub
cat $GITHUB_RSA.pub
echo
echo $MOZILLA_RSA.pub
cat $MOZILLA_RSA.pub
