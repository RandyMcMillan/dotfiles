if [[ "$SHELL" == "/bin/zsh" ]]; then
zsh --emulate sh
source ./checkbrew.sh
checkbrew
brew install zsh-vi-mode
# Enable vi mode
bindkey -v
# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(
  vi-mode
)
fi
[ -n "$PS1" ] && source ~/.bash_profile;
