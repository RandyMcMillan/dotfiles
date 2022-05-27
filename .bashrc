if [[ "$SHELL" == "/bin/zsh" ]]; then
zsh --emulate sh
fi
HOMEBREW_NO_INSTALL_CLEANUP=false
if ! hash fzf; then
brew install fzf || apt install fzf || apk add fzf
fi
complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+[\\:]*[a-zA-Z0-9_.-]+:([^=]|$)' ?akefile | sort | uniq | sed 's/[^a-zA-Z0-9_.-]*$//' | sed 's/[\]//g' | fzf\`" make
[ -n "$PS1" ] && source ~/.bash_profile;
