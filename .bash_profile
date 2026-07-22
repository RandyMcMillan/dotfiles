export HOMEBREW_NO_AUTO_UPDATE=1
export GIT_DISCOVERY_ACROSS_FILESYSTEM=1
PATH+=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11
export RUSTC_WRAPPER=$(which sccache)

if [ -r "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi
