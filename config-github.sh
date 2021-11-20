#!/usr/bin/env bash
config-github() {

    DATE=$(date +%s)

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

    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    touch     ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    touch     ~/.ssh/known_hosts
    chmod 644 ~/.ssh/known_hosts
    touch     ~/.ssh/config
    chmod 644 ~/.ssh/config

    mv ~/.ssh/config ~/.ssh/config.bak.$DATE
    echo "Host *" > ~/.ssh/config
    echo "  AddKeysToAgent yes" >> ~/.ssh/config

    GITHUB_RSA=~/.ssh/$DATE.github_rsa
    DOCKER_RSA=~/.ssh/$DATE.docker_rsa
    DO_RSA=~/.ssh/$DATE.do_rsa
    ssh-keygen -t rsa -b 4096 -N '' -C $GITHUB_USER_EMAIL -f $GITHUB_RSA
    echo "  IdentityFile $GITHUB_RSA" >> ~/.ssh/config
    ssh-keygen -t rsa -b 4096 -N '' -C $GITHUB_USER_EMAIL -f $DOCKER_RSA
    echo "  IdentityFile $DOCKER_RSA" >> ~/.ssh/config
    ssh-keygen -t rsa -b 4096 -N '' -C $GITHUB_USER_EMAIL -f $DO_RSA
    echo "  IdentityFile $DO_RSA" >> ~/.ssh/config

    sudo chmod 600 $GITHUB_RSA
    sudo chmod 644 $GITHUB_RSA.pub
    sudo chmod 600 $DOCKER_RSA
    sudo chmod 644 $DOCKER_RSA.pub
    sudo chmod 600 $DO_RSA
    sudo chmod 644 $DO_RSA.pub

    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/github_rsa
    ssh-add ~/.ssh/docker_rsa
    ssh-add ~/.ssh/do_rsa
    ssh-add $GITHUB_RSA
    ssh-add $DOCKER_RSA
    ssh-add $DO_RSA

    echo
    cat ~/.ssh/config
    echo
    ls -lT $GITHUB_RSA.pub
    echo
    echo "Copy these pub keys to your github profile..."
    echo
    echo
    ls -lT $GITHUB_RSA.pub
    echo  "$GITHUB_RSA.pub"
    echo
    cat $GITHUB_RSA.pub
    echo
    echo
    ls -lT $DOCKER_RSA.pub
    echo  "$DOCKER_RSA.pub"
    echo
    cat $DOCKER_RSA.pub
    echo
    echo
    ls -lT $DO_RSA.pub
    echo  "$DO_RSA.pub"
    echo
    cat $DO_RSA.pub
    echo
    echo
    fi
    gpg --list-secret-keys --keyid-format LONG
    read -p "Config gpg signing key? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p 'ENTER your GPG Signing Key: ' GPG_SIGNING_KEY
    #git config --global user.signingkey $GPG_SIGNING_KEY
    git config --global user.signingkey 97966C06BB06757B
    echo && echo
    echo Your GPG Siging Key has been added...
    echo && echo
    export GPG_TTY=$(tty)
    touch ~/.bash_profile
    if [ -r ~/.bash_profile ]; then echo 'export GPG_TTY=$(tty)' >> ~/.bash_profile; \
    else echo 'export GPG_TTY=$(tty)' >> ~/.profile; fi
    #if [ -r ~/.zshrc ]; then echo 'export GPG_TTY=$(tty)' >> ~/.zshrc; \
    #else echo 'export GPG_TTY=$(tty)' >> ~/.zprofile; fi
    fi
}
eval "$(ssh-agent -s)"
config-github
ssh-add
ssh-add ~/.ssh/*.github_rsa
./config-git.sh
#git config --global -l
