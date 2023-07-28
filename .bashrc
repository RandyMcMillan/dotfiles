[ -d .git ] || true [-f .git] && git config --global --add safe.directory $args[0] || echo

[ -n "$PS1" ] && source ~/.bash_profile;
