# homebrews should always take precedence
export PATH=/usr/local/bin:$PATH

#https://gist.github.com/denji/8706676
if [[ -s $HOME/.rvm/scripts/rvm ]]; then
  source $HOME/.rvm/scripts/rvm;
fi


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
