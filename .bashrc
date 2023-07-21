#echo 'export PATH="/usr/local/sbin:$PATH"' >> /Users/git/.bash_profile
rm -f ~/.gitconfig.lock
if ! hash brew 2>/dev/null; then
       eval "$(/usr/local/bin/brew shellenv)" || echo "install brew..."
       eval "$(/opt/homebrew/bin/brew shellenv)" || echo
fi
[ -n "$PS1" ] && source ~/.bash_profile;
