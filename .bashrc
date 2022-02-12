if [[ "$SHELL" == "/bin/zsh" ]]; then
zsh --emulate sh
fi
[ -n "$PS1" ] && source ~/.bash_profile;
