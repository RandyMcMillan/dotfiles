#spacemacs variables
#export needed to make this a env variable
#export SPACEMACSDIR=~/dotfiles/.spacemacs.d/
#
export PATH=/usr/local/bin:$PATH
# Initialize rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi
# Fix $PATH for homebrew
homebrew=/usr/local/bin:/usr/local/sbin
export PATH=$homebrew:$PATH
python2dot7=/usr/local/bin/python2.7
export PATH=$python2dot7:$PATH
export PATH=/usr/local/bin:$PATH
export PATH=/usr/local/opt/fzf/install:$PATH
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
