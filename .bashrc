if [ $VIM ]; then
    export PS1='\h:\w\$ '
source ~/.aliases
else
    [ -n "$PS1" ] && source ~/.bash_profile

fi

export EDITOR=/usr/bin/vim
export VISUAL=/usr/bin/vim
