#!/usr/bin/env bash

configGithub() {


    read -p "Config github? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
    #REF:https://help.github.com/en/github/authenticating-to-github/checking-for-existing-gpg-keys
    gpg --list-secret-keys --keyid-format LONG
    echo randymcmillan | read -p 'ENTER your Github.com username: ' GITHUB_USER_NAME
    #read -sp 'Password: ' GITHUB_USER_PASSWORD
    git config --global user.name $GITHUB_USER_NAME
    echo Thankyou $GITHUB_USER_NAME
    echo randy.lee.mcmillan@gmail.com | read -p 'ENTER your Github.com user email: ' GITHUB_USER_EMAIL
    git config --global user.email $GITHUB_USER_EMAIL
    echo Thankyou $GITHUB_USER_NAME for your email.
    echo 97966C06BB06757B | read -p 'ENTER your public gpg signing key id: ' PUBLIC_GPG_SIGNING_KEY_ID
    git config --global user.signingkey $PUBLIC_GPG_SIGNING_KEY_ID
    echo Thankyou $GITHUB_USER_NAME for public gpg signing key id.
    fi;

}
configGithub
