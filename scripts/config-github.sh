#!/usr/bin/env bash
config-github() {

    DATE=$(date +%s)

    read -r -p "Config github? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -r -p 'ENTER your Github.com username: ' GITHUB_USER_NAME
    #read -sp 'Password: ' GITHUB_USER_PASSWORD
    git config --global user.name "$GITHUB_USER_NAME"
    echo Thankyou "$GITHUB_USER_NAME"
    read -r -p 'ENTER your Github.com user email: ' GITHUB_USER_EMAIL
    git config --global user.email "$GITHUB_USER_EMAIL"
    # git config --global user.email randy.lee.mcmillan@gmail.com
    echo Thankyou "$GITHUB_USER_NAME" for your email.
    #REF:https://help.github.com/en/github/authenticating-to-github/checking-for-existing-gpg-keys

    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    touch     ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    touch     ~/.ssh/known_hosts
    chmod 644 ~/.ssh/known_hosts
    touch     ~/.ssh/config
    chmod 644 ~/.ssh/config

    cp ~/.ssh/config ~/.ssh/config.bak."$DATE"

    GITHUB_RSA=~/.ssh/$DATE.github_rsa
    DOCKER_RSA=~/.ssh/$DATE.docker_rsa
    DO_RSA=~/.ssh/$DATE.do_rsa
    ssh-keygen -t rsa -b 4096 -N '' -C "$GITHUB_USER_EMAIL" -f "$GITHUB_RSA"
    ssh-keygen -t rsa -b 4096 -N '' -C "$GITHUB_USER_EMAIL" -f "$DOCKER_RSA"
    ssh-keygen -t rsa -b 4096 -N '' -C "$GITHUB_USER_EMAIL" -f "$DO_RSA"

    # Append a host-scoped entry instead of replacing the whole config with
    # "Host *" IdentityFiles, which breaks all SSH if these keys go missing.
    {
        echo ""
        echo "Host github.com"
        echo "  AddKeysToAgent yes"
        echo "  IdentitiesOnly yes"
        echo "  IdentityFile $GITHUB_RSA"
    } >> ~/.ssh/config

    chmod 600 "$GITHUB_RSA" "$DOCKER_RSA" "$DO_RSA"
    chmod 644 "$GITHUB_RSA.pub" "$DOCKER_RSA.pub" "$DO_RSA.pub"

    eval "$(ssh-agent -s)"
    ssh-add "$GITHUB_RSA"
    ssh-add "$DOCKER_RSA"
    ssh-add "$DO_RSA"

    echo
    cat ~/.ssh/config
    echo
    ls -lT "$GITHUB_RSA.pub"
    echo
    echo "Copy these pub keys to your github profile..."
    echo
    echo
    ls -lT "$GITHUB_RSA.pub"
    echo  "$GITHUB_RSA.pub"
    echo
    cat "$GITHUB_RSA.pub"
    echo
    echo
    fi
    gpg --list-secret-keys --keyid-format LONG
    read -r -p "Config gpg signing key? (y/n) " -n 1;
    echo "";
    if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -r -p 'ENTER your GPG Signing Key: ' GPG_SIGNING_KEY
    git config --global user.signingkey "$GPG_SIGNING_KEY"
    # git config --global user.signingkey 97966C06BB06757B
    echo && echo
    echo Your GPG Siging Key has been added...
    echo && echo
    GPG_TTY=$(tty)
    export GPG_TTY
    touch ~/.bash_profile
    # if [ -r ~/.bash_profile ]; then echo 'export GPG_TTY=$(tty)' >> ~/.bash_profile; \
    #else echo 'export GPG_TTY=$(tty)' >> ~/.profile; fi
    #if [ -r ~/.zshrc ]; then echo 'export GPG_TTY=$(tty)' >> ~/.zshrc; \
    #else echo 'export GPG_TTY=$(tty)' >> ~/.zprofile; fi
    fi
}
eval "$(ssh-agent -s)"
ssh-add
config-github
ssh-add
# ssh-add ~/.ssh/*.github_rsa
# ./config-git.sh
# git config --global -l
ssh -v git@github.com
#./install-github-utility.sh
