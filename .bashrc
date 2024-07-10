export HOMEBREW_NO_AUTO_UPDATE=1
export GIT_DISCOVERY_ACROSS_FILESYSTEM=1
PATH+=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11
[ -d .git ] >/dev/null || true [-f .git] >/dev/null && git config --global --add safe.directory $args[0] 2>/dev/null || true

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

[ -n "$PS1" ] && source ~/.bash_profile;
