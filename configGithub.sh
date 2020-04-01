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
    
    #!/usr/bin/env bash

    #REF: https://gist.github.com/grenade/6318301
    #REF: https://www.digitalocean.com/docs/droplets/resources/troubleshooting-ssh/authentication/#fixing-key-permissions-and-ownership

    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    chmod 644 ~/.ssh/known_hosts
    chmod 644 ~/.ssh/config

    #ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/id_rsa
    #ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/github_rsa
    #ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/mozilla_rsa

    chmod 600 ~/.ssh/id_rsa
    chmod 644 ~/.ssh/id_rsa.pub

    chmod 600 ~/.ssh/github_rsa
    chmod 644 ~/.ssh/github_rsa.pub

    chmod 600 ~/.ssh/mozilla_rsa
    chmod 644 ~/.ssh/mozilla_rsa.pub

    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_rsa
    ssh-add ~/.ssh/github_rsa
    ssh-add ~/.ssh/mozilla_rsa

    ##Throw away keys
    #
    #DATE=$(date +%s)
    #
    #ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/$DATE.id_rsa
    #ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/$DATE.github_rsa
    #ssh-keygen -t rsa -b 4096 -N '' -C "randy.lee.mcmillan@gmail.com" -f ~/.ssh/$DATE.mozilla_rsa
    #
    #eval "$(ssh-agent -s)"
    #ssh-add ~/.ssh/$DATE.id_rsa
    #ssh-add ~/.ssh/$DATE.github_rsa
    #ssh-add ~/.ssh/$DATE.mozilla_rsa
    #
    #sudo chmod 600 ~/.ssh/$DATE.id_rsa
    #sudo chmod 644 ~/.ssh/$DATE.id_rsa.pub
    #sudo chmod 600 ~/.ssh/$DATE.github_rsa
    #sudo chmod 644 ~/.ssh/$DATE.github_rsa.pub
    #sudo chmod 600 ~/.ssh/$DATE.mozilla_rsa
    #sudo chmod 644 ~/.ssh/$DATE.mozilla_rsa.pub

}
configGithub
