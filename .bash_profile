if [[ "$SHELL" == "/bin/zsh" ]]; then
zsh --emulate sh
fi

#PYCOIN_CACHE_DIR=~/.pycoin_cache
#PYCOIN_BTC_PROVIDERS="blockchain.info blockexplorer.com chain.so"
#export PYCOIN_CACHE_DIR PYCOIN_BTC_PROVIDERS
#export PYCOIN_XTN_PROVIDERS="blockchain.info"  # For Bitcoin testnet

# Add `~/bin` to the `$PATH`
export PATH="$HOME/bin:$PATH";
# Add `~/init` to the `$PATH`
export PATH="$HOME/init:$PATH";

if which brew &> /dev/null; then
        echo 'export PATH="/usr/local/sbin:$PATH"' >> $HOME/.bash_profile
       if [[ "$OSTYPE" == "linux"* ]]; then
               #CHECK APT
               if [[ "$OSTYPE" == "linux-gnu" ]]; then
                       echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> $HOME/.bash_profile
                       eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
               fi
       fi
fi
# Load the shell dotfiles, and then some:
# * ~/.path can be used to extend `$PATH`.
# * ~/.extra can be used for other settings you don’t want to commit.
for file in ~/.{path,bash_prompt,exports,aliases,functions,extra,~/dotfiles/*.sh}; do
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
if which brew &> /dev/null && [ -r "$(brew --prefix)/etc/profile.d/bash_completion.sh" ]; then
	# Ensure existing Homebrew v1 completions continue to work
	set BASH_COMPLETION_COMPAT_DIR="$(brew --prefix)/etc/bash_completion.d";
	export BASH_COMPLETION_COMPAT_DIR
	source "$(brew --prefix)/etc/profile.d/bash_completion.sh";
elif [ -f /etc/bash_completion ]; then
	source /etc/bash_completion;
fi;

## add docker bash completion
#
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi

## Enable tab completion for `g` by marking it as an alias for `git`
if type _git &> /dev/null; then
	complete -o default -o nospace -F _git g;
fi;
#
# Add tab completion for SSH hostnames based on ~/.ssh/config, ignoring wildcards
[ -e "$HOME/.ssh/config" ] && complete -o "default" -o "nospace" -W "$(grep "^Host" ~/.ssh/config | grep -v "[?*]" | cut -d " " -f2- | tr ' ' '\n')" scp sftp ssh;

# Add tab completion for `defaults read|write NSGlobalDomain`
# You could just use `-g` instead, but I like being explicit
complete -W "NSGlobalDomain" defaults;

# Add `killall` tab completion for common apps
complete -o "nospace" -W "Siri Wi-Fi Preview Adobe* Little* Contacts Calendar Dock Finder Mail Safari iTunes* SystemUIServer Terminal iTerm* Twitter bitcoind" killall;

# Added by install_latest_perl_osx.pl
#[ -r /Users/git/.bashrc ] && source /Users/git/.bashrc

# REF: dotfiles/install-fastlane.sh
export PATH="$HOME/.fastlane/bin:$PATH"

#USeing rbenv for stuff ruby 2.2.2 doent compile on macos

#eval "$(rbenv init -)"

test -e "${HOME}/.iterm2_shell_integration.bash" && source "${HOME}/.iterm2_shell_integration.bash"

if [ -f $(PWD)/Makefile ]; then
complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)' Makefile | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make
fi

if [ -f $(PWD)/GNUMakefile ]; then
complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)' GNUmakefile | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make
fi

if [ -f $(PWD)/funcs.mk ]; then
complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)' GNUmakefile | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make
fi

# for OUTPUT in $(ls -f *.mk)
# do
# complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)' $OUTPUT | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make -f $OUTPUT
# done

export GPG_TTY=$(tty)
export PATH="/usr/local/opt/ruby@2.5.8/bin:$PATH"
export PATH="/usr/local/opt/ruby@2.5/bin:$PATH"
export PATH="/usr/local/opt/openssl@1.1/bin:$PATH"
export PATH="/usr/local/opt/qt@5/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"
export PATH="/usr/local/sbin:$PATH"
export PATH="/usr/local/opt/openssl@1.1/bin:$PATH"
export PATH="/usr/local/opt/openssl@3/bin:$PATH"
export PATH="/usr/local/opt/qt@5/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"

if [ "$OSTYPE" == "Linux"* ]; then
    if ! hash brew 2>/dev/null; then
        eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    fi
fi
export PATH="/usr/local/sbin:$PATH"
export PATH="/usr/local/opt/qt@5/bin:$PATH"
