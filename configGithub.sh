#!/usr/bin/env bash

configGithub() {

    read -p "Config github? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
    #REF:https://help.github.com/en/github/authenticating-to-github/checking-for-existing-gpg-keys
    gpg --list-secret-keys --keyid-format LONG
    read -p 'ENTER your Github.com username: ' GITHUB_USER_NAME
    #read -sp 'Password: ' GITHUB_USER_PASSWORD
    git config --global user.name $GITHUB_USER_NAME
    echo Thankyou $GITHUB_USER_NAME
    read -p 'ENTER your Github.com user email: ' GITHUB_USER_EMAIL
    git config --global user.email $GITHUB_USER_EMAIL
    echo Thankyou $GITHUB_USER_NAME for your email.
    fi;

#REF: https://gist.github.com/grenade/6318301
#REF: https://www.digitalocean.com/docs/droplets/resources/troubleshooting-ssh/authentication/#fixing-key-permissions-and-ownership

    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    chmod 644 ~/.ssh/known_hosts
    chmod 644 ~/.ssh/config

    DATE=$(date +%s)

    ssh-keygen -t rsa -b 4096 -N '' -C $GITHUB_USER_EMAIL -f ~/.ssh/$DATE.id_rsa
    ssh-keygen -t rsa -b 4096 -N '' -C $GITHUB_USER_EMAIL -f ~/.ssh/$DATE.github_rsa
    ssh-keygen -t rsa -b 4096 -N '' -C $GITHUB_USER_EMAIL -f ~/.ssh/$DATE.mozilla_rsa

    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/$DATE.id_rsa
    ssh-add ~/.ssh/$DATE.github_rsa
    ssh-add ~/.ssh/$DATE.mozilla_rsa

    sudo chmod 600 ~/.ssh/$DATE.id_rsa
    sudo chmod 644 ~/.ssh/$DATE.id_rsa.pub
    sudo chmod 600 ~/.ssh/$DATE.github_rsa
    sudo chmod 644 ~/.ssh/$DATE.github_rsa.pub
    sudo chmod 600 ~/.ssh/$DATE.mozilla_rsa
    sudo chmod 644 ~/.ssh/$DATE.mozilla_rsa.pub

}
configGithub


echo "Copy this key to your github profile..."
 cat ~/.ssh/$DATE.github_rsa
 echo "Generic id_rsa"
 cat ~/.ssh/$DATE.id_rsa
 echo "another key"
 cat ~/.ssh/$DATE.mozilla_rsa
