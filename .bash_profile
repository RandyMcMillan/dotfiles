#if [ -f ~/.bashrc ]; then
 #  source ~/.bashrc
#fi

# Load ~/.extra, ~/.bash_prompt, ~/.exports, ~/.aliases and ~/.functions
# ~/.extra can be used for settings you don’t want to commit
for file in ~/.{bash_prompt,exports,aliases,profile,functions,extra}; do
	[ -r "$file" ] && source "$file"
done
unset file

# Case-insensitive globbing (used in pathname expansion)
shopt -s nocaseglob

# Append to the Bash history file, rather than overwriting it
shopt -s histappend

# Autocorrect typos in path names when using `cd`
shopt -s cdspell

# Prefer US English and use UTF-8
export LC_ALL="en_US.UTF-8"
export LANG="en_US"

# Add tab completion for SSH hostnames based on ~/.ssh/config, ignoring wildcards
[ -e "$HOME/.ssh/config" ] && complete -o "default" -o "nospace" -W "$(grep "^Host" ~/.ssh/config | grep -v "[?*]" | cut -d " " -f2)" scp sftp ssh

#ssh
ps -e | grep [s]sh-agent
ssh-add -l
#SSH FILE PERMISSIONS
chmod 700 ~/.ssh
chmod 700 ~/.ssh && chmod 600 ~/.ssh/*
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/my*
#chown randymcmillan:randymcmillan ~/.ssh/authorized_keys
#chown randymcmillan:randymcmillan ~/.ssh


# REF http://www.funtoo.org/Keychain
# brew install keychain
eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh *.pub`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/DSiM_rsa.pub`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/my_git_key`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/*t_key2`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/my_git_key`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/my_git_key2`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/*_persis`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/rootsinr_persis`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/xpatriot_persis_rsa`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/randymcmillan_rsa`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/roots_key_persis`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/*_key`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/*_key2`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/*_rsa`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/*_persis`
#eval `keychain --quiet --eval --agents ssh ~/.ssh/*_persis_rsa`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/DSiM_rsa.pub`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh my_git_key`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/*t_key2`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/my_git_key`
#eval `keychain --noask --quick --ignore-missing --ignore-missing --quiet --eval --agents ssh ~/.ssh/my_git_key2`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/*_persis`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/rootsinr_persis`
#eval `keychain --noask --quick --ignore-missing --ignore-missing --quiet --eval --agents ssh ~/.ssh/xpatriot_persis_rsa`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/randymcmillan_rsa`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/roots_key_persis`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/*_key`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/*_key2`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/*_rsa`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/*_persis`
#eval `keychain --noask --quick --ignore-missing --quiet --eval --agents ssh ~/.ssh/*_persis_rsa`
# Add tab completion for `defaults read|write NSGlobalDomain`
# You could just use `-g` instead, but I like being explicit
complete -W "NSGlobalDomain" defaults

# Add `killall` tab completion for common apps
complete -o "nospace" -W "Finder Dock Mail Safari iTunes iCal Address\ Book
SystemUIServer Activity\ Monitor" killall

#REF: https://github.com/Linuxbrew/linuxbrew/find/master
export PATH="$HOME/.linuxbrew/bin:$PATH"
export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"
export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"
#eval "$(uru_rt admin install)"


function path_prepend() {
    if [ -d "$1" ]; then
        PATH=${PATH//":$1:"/:} #delete all instances in the middle
        PATH=${PATH/%":$1"/} #delete any instance at the end
        PATH=${PATH/#"$1:"/} #delete any instance at the beginning
        PATH="$1${PATH:+":$PATH"}" #prepend $1 or if $PATH is empty set to $1
    fi
}
# This is needed so HomeBrew packages get priority
path_prepend '/usr/local/bin'
git config --global color.ui auto

# Aliases
alias vi='/Applications/MacVim.app/Contents/MacOS/Vim'
alias vim='/Applications/MacVim.app/Contents/MacOS/Vim'
alias gvi='/Applications/MacVim.app/Contents/MacOS/Vim -g'
