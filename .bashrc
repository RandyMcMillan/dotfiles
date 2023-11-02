PATH+=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11
[ -d .git ] || true [-f .git] && git config --global --add safe.directory $args[0] || echo

[ -d "$HOME/.cargo/env" ] && source "$HOME/.cargo/env" || echo

[ -n "$PS1" ] && source ~/.bash_profile;

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# pnpm
export PNPM_HOME="/Users/git/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end
