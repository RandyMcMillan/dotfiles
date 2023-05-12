rm -f ~/.gitconfig.lock

if ! hash brew 2>/dev/null; then
       eval "$(/usr/local/bin/brew shellenv)" || echo
       eval "$(/opt/homebrew/bin/brew shellenv)" || echo
fi

[ -n "$PS1" ] && source ~/.bash_profile;
