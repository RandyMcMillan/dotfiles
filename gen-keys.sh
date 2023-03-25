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

#Primary keys
ID_RSA=~/.ssh/id_rsa
GITHUB_RSA=~/.ssh/github_rsa
MOZILLA_RSA=~/.ssh/mozilla_rsa

#Start ssh-agent
eval "$(ssh-agent -s)"

#Generate Keys with $DATE prefix
#Create first incase primary keys not exist
ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/$DATE.id_rsa
ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/$DATE.github_rsa
ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/$DATE.mozilla_rsa

#Copy generated keys to keep as primary keys if not exist
if [ -f "$ID_RSA" ]; then
    echo "$ID_RSA exists!"
else
    echo "Copying $DATE.id_rsa to $ID_RSA"
    cp  ~/.ssh/$DATE.id_rsa $ID_RSA
    cp  ~/.ssh/$DATE.id_rsa.pub $ID_RSA.pub
fi
ssh-add $ID_RSA
ssh-add ~/.ssh/$DATE.id_rsa

if [ -f "$GITHUB_RSA" ]; then
    echo "$GITHUB_RSA exists!"
else
    echo "Copying $DATE.github_rsa to $GITHUB_RSA"
    cp  ~/.ssh/$DATE.github_rsa $GITHUB_RSA
    cp  ~/.ssh/$DATE.github_rsa.pub $GITHUB_RSA.pub
fi
ssh-add $GITHUB_RSA
ssh-add ~/.ssh/$DATE.github_rsa

if [ -f "$MOZILLA_RSA" ]; then
    echo "$MOZILLA_RSA exists!"
else
    echo "Copying $DATE.mozilla_rsa to $MOZILLA_RSA"
    cp  ~/.ssh/$DATE.mozilla_rsa $MOZILLA_RSA
    cp  ~/.ssh/$DATE.mozilla_rsa.pub $MOZILLA_RSA.pub
fi
ssh-add $MOZILLA_RSA
ssh-add ~/.ssh/$DATE.mozilla_rsa

#Some more file permissions
#for Primary keys and prefixed keys
chmod 600 $ID_RSA
chmod 644 $ID_RSA.pub

chmod 600 ~/.ssh/$DATE.id_rsa
chmod 644 ~/.ssh/$DATE.id_rsa.pub

chmod 600 $GIHUB_RSA
chmod 644 $GITHUB_RSA.pub

chmod 600 ~/.ssh/$DATE.github_rsa
chmod 644 ~/.ssh/$DATE.github_rsa.pub

chmod 600 $MOZILLA_RSA
chmod 644 $MOZILLA_RSA.pub

chmod 600 ~/.ssh/$DATE.mozilla_rsa
chmod 644 ~/.ssh/$DATE.mozilla_rsa.pub

