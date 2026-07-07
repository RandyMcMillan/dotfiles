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
    echo "Copying $DATE.id_rsa to $DATE.id_rsa"
    cp  ~/.ssh/$DATE.id_rsa ~/.ssh/$ID_RSA
fi
ssh-add ~/.ssh/id_rsa
ssh-add ~/.ssh/$DATE.id_rsa

if [ -f "$GITHUB_RSA" ]; then
    echo "$GITHUB_RSA exists!"
else
    echo "Copying $DATE.github_rsa to $DATE.id_rsa"
    cp  ~/.ssh/$DATE.github_rsa ~/.ssh/$GITHUB_RSA
fi
ssh-add ~/.ssh/github_rsa
ssh-add ~/.ssh/$DATE.github_rsa

if [ -f "$MOZILLA_RSA" ]; then
    echo "$MOZILLA_RSA exists!"
else
    echo "Copying $DATE.mozilla_rsa to $DATE.mozilla_rsa"
    cp  ~/.ssh/$DATE.mozilla_rsa ~/.ssh/$MOZILLA_RSA
fi
ssh-add ~/.ssh/mozilla_rsa
ssh-add ~/.ssh/$DATE.mozilla_rsa

#Some more file permissions
#for Primary keys and prefixed keys
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

chmod 600 ~/.ssh/$DATE.id_rsa
chmod 644 ~/.ssh/$DATE.id_rsa.pub

chmod 600 ~/.ssh/github_rsa
chmod 644 ~/.ssh/github_rsa.pub

chmod 600 ~/.ssh/$DATE.github_rsa
chmod 644 ~/.ssh/$DATE.github_rsa.pub

chmod 600 ~/.ssh/mozilla_rsa
chmod 644 ~/.ssh/mozilla_rsa.pub

chmod 600 ~/.ssh/$DATE.mozilla_rsa
chmod 644 ~/.ssh/$DATE.mozilla_rsa.pub
