rm -f ~/.gitconfig.lock

if ! hash brew 2>/dev/null; then
       eval "$(/usr/local/bin/brew shellenv)" 2> >(tee -a bash_profile.log) || echo
       eval "$(/opt/homebrew/bin/brew shellenv)" 2> >(tee -a bash_profile.log)
fi

[ -n "$PS1" ] && source ~/.bash_profile; 2> >(tee -a bash_profile.log)
