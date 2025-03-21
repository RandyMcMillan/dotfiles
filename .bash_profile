#!/usr/bin/env bash
##
if [ -f ~/config-git ]; then
	source ~/config-git 2> >(tee -a /tmp/bash_profile.log) 2>/dev/null
fi
if [ -f "$HOME/.cargo/env" ]; then
	source "$HOME/.cargo/env" 2> >(tee -a /tmp/bash_profile.log) 2>/dev/null
else
    type -P rustup && rustup default stable
fi
##
if hash brew 2>/dev/null; then
	if [ -f /usr/local/bin/checkbrew ]; then
	source /usr/local/bin/checkbrew
	fi
fi

##just completion
complete -F _just -o bashdefault -o default j

# Add `~/bin` to the `$PATH`
export PATH="$HOME/bin:$PATH";
export PATH="/usr/local/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"
# Add `~/init` to the `$PATH`
export PATH="$HOME/init:$PATH";
## Load the shell dotfiles, and then some:
# * ~/.path can be used to extend `$PATH`.
# * ~/.extra can be used for other settings you don’t want to commit.
for file in ~/.{aliases,bash_prompt,exports,extra,functions,path}; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;
unset file;
#
# Case-insensitive globbing (used in pathname expansion)
shopt -s nocaseglob;

# Append to the Bash history file, rather than overwriting it
shopt -s histappend;

# Autocorrect typos in path names when using `cd`
shopt -s cdspell;

# Enable some Bash 4 features when possible:
# * `autocd`, e.g. `**/qux` will enter `./foo/bar/baz/qux`
## * Recursive globbing, e.g. `echo **/*.txt`
for option in autocd globstar; do
	shopt -s "$option" 2> /dev/null;
done;
#

# Add tab completion for many Bash commands
if hash brew 2>/dev/null ; then
	if [ -r "$(brew --prefix)/etc/profile.d/bash_completion.sh" ]; then
		# Ensure existing Homebrew v1 completions continue to work
		set BASH_COMPLETION_COMPAT_DIR="$(brew --prefix)/etc/bash_completion.d";
		export BASH_COMPLETION_COMPAT_DIR
		source "$(brew --prefix)/etc/profile.d/bash_completion.sh";
	fi
elif [ -f /etc/bash_completion ]; then
	source /etc/bash_completion;
fi;

## Enable tab completion for `g` by marking it as an alias for `git`
## if type _git &> /dev/null; then
## 	complete -o default -o nospace -F _git g;
## fi;
#
# Add tab completion for SSH hostnames based on ~/.ssh/config, ignoring wildcards
[ -e "$HOME/.ssh/config" ] && complete -o "default" -o "nospace" -W "$(grep "^Host" ~/.ssh/config | grep -v "[?*]" | cut -d " " -f2- | tr ' ' '\n')" scp sftp ssh;

# Add tab completion for `defaults read|write NSGlobalDomain`
# You could just use `-g` instead, but I like being explicit
complete -W "NSGlobalDomain" defaults;

# Add `killall` tab completion for common apps
complete -o "nospace" -W "Contacts Calendar Dock Finder Mail Safari iTunes SystemUIServer Terminal Twitter Siri Wi-Fi Preview Adobe* Little* Contacts Calendar Dock Finder Mail Safari iTunes* SystemUIServer Terminal iTerm* Twitter bitcoind" killall;

## .bashrc
## export NVM_DIR="$HOME/.nvm"
## [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
## [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
##
# Added by install_latest_perl_osx.pl
#[ -r /Users/git/.bashrc ] && source /Users/git/.bashrc

# REF: dotfiles/install-fastlane.sh
# export PATH="$HOME/.fastlane/bin:$PATH"

#Using rbenv for stuff ruby 2.2.2 doent compile on macos

#eval "$(rbenv init -)"


if test -f /usr/bin/true; then
  echo "/usr/bin/true exists" &>/dev/null
fi

for OUTPUT in $(ls -f Makefile 2>/dev/null)
do

#echo $OUTPUT

complete -W "`([[ -r $OUTPUT ]] && grep -oE '^[a-zA-Z0-9_-]+:([^=]|$)' $OUTPUT || cat /dev/null) | sed 's/[^a-zA-Z0-9_-]*$//'`" make

## complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)'    $OUTPUT | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make

done
for OUTPUT in $(ls -f GNUmakefile 2>/dev/null)
do

#echo $OUTPUT

complete -W "`([[ -r $OUTPUT ]] && grep -oE '^[a-zA-Z0-9_-]+:([^=]|$)' $OUTPUT || cat /dev/null) | sed 's/[^a-zA-Z0-9_-]*$//'`" make
##complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)'    $OUTPUT | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make

done

#export GPG_TTY=$(tty)
# Set PATH, MANPATH, etc., for Homebrew.
if ! hash brew 2>/dev/null; then
       eval "$(/usr/local/bin/brew shellenv)" 2> >(tee -a bash_profile.log)
       eval "$(/opt/homebrew/bin/brew shellenv)" 2> >(tee -a bash_profile.log)
fi
