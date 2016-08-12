#vim

if [ -f /usr/local/bin/vim ]; then

export EDITOR=/usr/local/bin/vim
export VISUAL=/usr/local/bin/vim

else

export EDITOR=/usr/bin/vim
export VISUAL=/usr/bin/vim

fi

if [ $VIM ]; then
    export PS1='\h:\w\$ '
source ~/.aliases
else
    [ -n "$PS1" ] && source ~/.bash_profile

fi
