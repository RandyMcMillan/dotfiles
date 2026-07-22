#!/usr/bin/env bash
#

if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    # Standard Note Fetching
    git config --global alias.fetchnotes '!f() { git config --add remote.${1:-origin}.fetch "+refs/notes/*:refs/notes/*" && git fetch ${1:-origin}; }; f'
    
    # Logging and Navigation
    git config --global alias.lognotes "log -g refs/notes/commits --pretty=format:'%h %gd %gs' --show-notes=*"
    git config --global alias.note-follow '!f() { target=$(git notes show ${1:-HEAD} | grep -oE "[a-f0-9]{7,40}" | head -n1); if [ -n "$target" ]; then git show $target; else echo "No hash found in note"; fi; }; f'
    
    # Discovery Aliases
    git config --global alias.find-note-owner '!f() { NOTE_BLOB=$1; if [ -z "$NOTE_BLOB" ]; then echo "Usage: git find-note-owner <note-blob-hash>"; return 1; fi; TARGET_LINE=$(git ls-tree -r refs/notes/commits | grep "$NOTE_BLOB"); if [ -z "$TARGET_LINE" ]; then echo "No note found with blob hash $NOTE_BLOB"; return 1; fi; TARGET_COMMIT=$(echo "$TARGET_LINE" | awk "{print \$4}"); echo "Target Commit: $TARGET_COMMIT"; git log -1 "$TARGET_COMMIT"; }; f'
    git config --global alias.find-note-targets "!f() { git ls-tree -r refs/notes/commits | awk '{print \$4}'; }; f"

    # The Optimized Summary (Handles Orphans & Colors)
    git config --global alias.notes-summary '!f() { RED=$(tput setaf 1); CLR=$(tput sgr0); for target in $(git find-note-targets); do if git cat-file -e "$target" 2>/dev/null; then printf "Target: %s | " "$target"; git log -1 --format="%C(auto)%h %s" "$target"; else printf "Target: %s | ${RED}ORPHANED (Commit Missing)${CLR}\n" "$target"; fi; git notes show "$target" 2>/dev/null | sed "s/^/  [Note]: /"; echo "-------------------------------------------------------"; done; }; f'
fi

#if [ -f ~/config-git ]; then
#	source ~/config-git 2> >(tee -a /tmp/bash_profile.log) 2>/dev/null
#fi
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
if [ -f "$(brew --prefix)/etc/bash_completion" ]; then
    . "$(brew --prefix)/etc/bash_completion"
fi

GIT_COMPLETION_PATH="$(brew --prefix)/share/bash-completion/completions/git"

if [ -f "$GIT_COMPLETION_PATH" ]; then
    # Load the official git completion
    source "$GIT_COMPLETION_PATH"
fi


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
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Added by install_latest_perl_osx.pl
#[ -r /Users/git/.bashrc ] && source /Users/git/.bashrc

# REF: dotfiles/install-fastlane.sh
# export PATH="$HOME/.fastlane/bin:$PATH"

#Using rbenv for stuff ruby 2.2.2 doent compile on macos

#eval "$(rbenv init -)"


if test -f /usr/bin/true; then
  echo "/usr/bin/true exists" &>/dev/null
fi

## for OUTPUT in $(ls -f Makefile 2>/dev/null)
## do
## 
## #echo $OUTPUT
## 
## complete -W "`([[ -r $OUTPUT ]] && grep -oE '^[a-zA-Z0-9_-]+:([^=]|$)' $OUTPUT || cat /dev/null) | sed 's/[^a-zA-Z0-9_-]*$//'`" make
## 
## ## complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)'    $OUTPUT | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make
## 
## done
## for OUTPUT in $(ls -f GNUmakefile 2>/dev/null)
## do
## 
## #echo $OUTPUT
## 
## complete -W "`([[ -r $OUTPUT ]] && grep -oE '^[a-zA-Z0-9_-]+:([^=]|$)' $OUTPUT || cat /dev/null) | sed 's/[^a-zA-Z0-9_-]*$//'`" make
## ##complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)'    $OUTPUT | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make
## 
## done


# Custom completion function for Make
_make_targets() {
    # 1. Look for a Makefile or GNUmakefile in the current directory
    local makefile=""
    if [[ -f GNUmakefile ]]; then
        makefile="GNUmakefile"
    #elif [[ -f Makefile ]]; then
    #    makefile="Makefile"
    fi

    # 2. If a Makefile exists, parse it for targets
    if [[ -n "$makefile" ]]; then
        # Grep targets: lines starting with a letter/digit followed by a colon
        # Excludes lines that start with a dot (like .PHONY) or contains '=' (variables)
        local targets=$(grep -oE '^[a-zA-Z0-9_-]+:' "$makefile" | sed 's/://')
        COMPREPLY=( $(compgen -W "${targets}" -- "${COMP_WORDS[COMP_CWORD]}") )
    else
        # 3. If no Makefile exists, do nothing (or fallback to file completion if desired)
        return 0
    fi
}

# 4. Bind the function specifically to 'make'
complete -F _make_targets make

## _make_targets() {
##     # Get the word currently being typed
##     local cur="${COMP_WORDS[COMP_CWORD]}"
##     
##     # Extract all targets from the Makefile (lines starting with [a-zA-Z0-9] followed by :)
##     # This works for both Makefile and GNUmakefile
##     if [[ -f GNUmakefile ]]; then
##         local targets=$(grep -oE '^[a-zA-Z0-9_-]+:' Makefile | sed 's/://')
##         COMPREPLY=( $(compgen -W "${targets}" -- ${cur}) )
##     fi
## }

# Example of a more robust completion logic
_make_completion() {
    if [[ -f GNUmakefile ]]; then
        # Only parse targets if a Makefile actually exists here
        COMPREPLY=( $(compgen -W "$(make -pRrq : 2>/dev/null | awk -F: '/^[a-zA-Z0-9][^$#\/\\t=]*:([^=]|$)/ {split($1,A,/ /);for(i in A)print A[i]}')" -- ${COMP_WORDS[COMP_CWORD]}) )
    fi
}
complete -F _make_targets make
complete -F _make_completion make

#export GPG_TTY=$(tty)
# Set PATH, MANPATH, etc., for Homebrew.
if ! hash brew 2>/dev/null; then
       eval "$(/usr/local/bin/brew shellenv)" 2> >(tee -a bash_profile.log)
       eval "$(/opt/homebrew/bin/brew shellenv)" 2> >(tee -a bash_profile.log)
fi

# Add opencode to PATH if installed via Homebrew
if [ -d "/usr/local/opt/opencode/bin" ]; then
       pathappend "/usr/local/opt/opencode/bin"
fi
if [ -f "/Applications/OpenCode.app/Contents/MacOS/opencode-cli" ]; then
       pathappend "/Applications/OpenCode.app/Contents/MacOS"
fi
