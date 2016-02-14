# Initialize rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi
# Fix $PATH for homebrew
homebrew=/usr/local/bin:/usr/local/sbin
export PATH=$homebrew:$PATH

export PATH=/usr/local/bin:$PATH
export PATH=/usr/local/opt/fzf/install:$PATH
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
