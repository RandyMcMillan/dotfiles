#!/usr/bin/env bash
./config-git.sh
config-github() {

    read -p "Config github? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p 'ENTER your Github.com username: ' GITHUB_USER_NAME
    #read -sp 'Password: ' GITHUB_USER_PASSWORD
    git config --global user.name $GITHUB_USER_NAME
    echo Thankyou $GITHUB_USER_NAME
    read -p 'ENTER your Github.com user email: ' GITHUB_USER_EMAIL
    #git config --global user.email $GITHUB_USER_EMAIL
    git config --global user.email randy.lee.mcmillan@gmail.com
    echo Thankyou $GITHUB_USER_NAME for your email.
    #REF:https://help.github.com/en/github/authenticating-to-github/checking-for-existing-gpg-keys
    gpg --list-secret-keys --keyid-format LONG
    read -p 'ENTER your GPG Signing Key: ' GPG_SIGNING_KEY
    #git config --global user.signingkey $GPG_SIGNING_KEY
    git config --global user.signingkey 97966C06BB06757B
    echo && echo
    echo Your GPG Siging Key has been added...
    echo && echo
    fi;

    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    chmod 644 ~/.ssh/known_hosts
    chmod 644 ~/.ssh/config

    DATE=$(date +%s)

    ssh-keygen -t rsa -b 4096 -N '' -C $GITHUB_USER_EMAIL -f ~/.ssh/$DATE.github_rsa
    ssh-keygen -t rsa -b 4096 -N '' -C $GITHUB_USER_EMAIL -f ~/.ssh/$DATE.docker_rsa

    sudo chmod 600 ~/.ssh/$DATE.github_rsa
    sudo chmod 644 ~/.ssh/$DATE.github_rsa.pub
    sudo chmod 600 ~/.ssh/$DATE.docker_rsa
    sudo chmod 644 ~/.ssh/$DATE.docker_rsa.pub

    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/github_rsa
    ssh-add ~/.ssh/docker_rsa
    ssh-add ~/.ssh/$DATE.github_rsa
    ssh-add ~/.ssh/$DATE.docker_rsa
		ssh-add ~/.ssh/*_rsa

    echo "Copy this pub key to your github profile..."
    cat ~/.ssh/$DATE.github_rsa.pub
    echo "a docker key pair"
    cat ~/.ssh/$DATE.docker_rsa.pub
		echo https://gorails.com/setup/osx/10.14-mojave
}
config-github
