if [ $VIM ]; then
    export PS1='\h:\w\$ '
source ~/.aliases
else
    [ -n "$PS1" ] && source ~/.bash_profile
    source ~/perl5/perlbrew/etc/bashrc
echo ".~/perl5/perlbrew/etc/bashrc" >> ~/.bashrc
fi
