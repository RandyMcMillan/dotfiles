#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE}")";

touch ~/session.log

#git pull origin master;
#git pull origin main;

function doIt() {
	rsync \
		--exclude ".DS_Store" \
		--exclude ".gitconfig" \
		--exclude ".nojekyll" \
		--exclude ".venv" \
		--exclude ".osx" \
		--exclude "AUTHORS" \
		--exclude "B.sh" \
		--exclude "Brewfile" \
		--exclude "CNAME" \
		--exclude "COPYING" \
		--exclude "Cargo.lock" \
		--exclude "Cargo.toml" \
		--exclude "Casks" \
		--exclude "ChangeLog" \
		--exclude "ColorProfile.icc" \
		--exclude "Formulae" \
		--exclude "GNUmakefile" \
		--exclude "GNUmakefile.in" \
		--exclude "INSTALL" \
		--exclude "LICENSE-MIT.txt" \
		--exclude "LittleSnitch-4.5.2.dmg" \
		--exclude "Makefile" \
		--exclude "Makefile.am" \
		--exclude "Makefile.in" \
		--exclude "NEWS" \
		--exclude "README.md" \
		--exclude "TIME" \
		--exclude "aclocal.m4" \
		--exclude "act.mk" \
		--exclude "adduser-git.sh" \
		--exclude "autogen.sh" \
		--exclude "autom4te.cache" \
		--exclude "bash_profile.log" \
		--exclude "bitcoin-libs" \
		--exclude "bitcoin-libs.sh" \
		--exclude "bitcoin-test-battery.sh" \
		--exclude "blockheight" \
		--exclude "boot-reset-boot-mode.sh" \
		--exclude "boot-safe-mode.sh" \
		--exclude "boot-single-user-mode.sh" \
		--exclude "boot-strap*" \
		--exclude "boot-verbose-mode.sh" \
		--exclude "bootstrap.sh" \
		--exclude "brew-bitcoin-gui.sh" \
		--exclude "brew-bitcoin-no-gui.sh" \
		--exclude "brew-list.sh" \
		--exclude "brew_install.sh" \
		--exclude "brew_install_version.sh" \
		--exclude "build-bitcoincore-dev-bitcoin-core.sh" \
		--exclude "build-bitcoincore-dev-bitcoin.org.sh" \
		--exclude "build-bitcoincore-dev-bitcoin.sh" \
		--exclude "build-bitcoincore-dev-gui.sh" \
		--exclude "build-bitcoincore-dev-org-builder.sh" \
		--exclude "build-bitcoincore.dev.grafana.sh" \
		--exclude "build-randymcmillan-gui.sh" \
		--exclude "builder-keys.sha256.txt" \
		--exclude "builder-keys.txt" \
		--exclude "builder-keys.txt.gpg" \
		--exclude "builder.keys.shasum.2.txt" \
		--exclude "builder.keys.shasum.txt" \
		--exclude "cargo.mk" \
		--exclude "checkbrew" \
		--exclude "checkbrew.sh" \
		--exclude "checkraspi.sh" \
		--exclude "compile" \
		--exclude "config-dock-prefs.sh" \
		--exclude "config-git" \
		--exclude "config-git.sh" \
		--exclude "config-github" \
		--exclude "config-github.sh" \
		--exclude "config-hosts-file.sh" \
		--exclude "config.h" \
		--exclude "config.h.in~" \
		--exclude "config.log" \
		--exclude "config.status" \
		--exclude "configure" \
		--exclude "configure.ac" \
		--exclude "configure~" \
		--exclude "depends" \
		--exclude "disable-macos-services.sh" \
		--exclude "disable.sh" \
		--exclude "do-mount-volume.sh" \
		--exclude "do-upgrade-agent.sh" \
		--exclude "enable-macos-services.sh" \
		--exclude "funcs.mk" \
		--exclude "gen-keys.sh" \
		--exclude "genKeys.sh" \
		--exclude "get-forks.sh" \
		--exclude "gnostr.mk" \
		--exclude "hercules.cnf" \
		--exclude "hooks" \
		--exclude "index.html" \
		--exclude "index.html.sig" \
		--exclude "init" \
		--exclude "install-Docker.sh" \
		--exclude "install-FastLane.sh" \
		--exclude "install-Miniconda3-latest-MacOSX-x86_64.bash" \
		--exclude "install-OSXFuse.sh" \
		--exclude "install-Onyx.sh" \
		--exclude "install-Ruby@2.4.bash" \
		--exclude "install-Ruby@2.5.bash" \
		--exclude "install-Ruby@2.6.bash" \
		--exclude "install-SassC.sh" \
		--exclude "install-XVim2+CS.bash" \
		--exclude "install-bash.bash" \
		--exclude "install-bdk-cli.sh" \
		--exclude "install-brew.sh" \
		--exclude "install-capnp.sh" \
		--exclude "install-cirrus.sh" \
		--exclude "install-clang-format.sh" \
		--exclude "install-common-lisp.sh" \
		--exclude "install-discord.sh" \
		--exclude "install-eq-mac.sh" \
		--exclude "install-firefox.sh" \
		--exclude "install-full-node.sh" \
		--exclude "install-gforth.sh" \
		--exclude "install-git-legit.sh" \
		--exclude "install-gitea.sh" \
		--exclude "install-github-utility.sh" \
		--exclude "install-gnupg+suite.sh" \
		--exclude "install-i2p.sh" \
		--exclude "install-iftop.sh" \
		--exclude "install-inkscape.sh" \
		--exclude "install-iterm2.sh" \
		--exclude "install-karabiner-elements.bash" \
		--exclude "install-keeping-you-awake.sh" \
		--exclude "install-little-snitch.sh" \
		--exclude "install-moby-engine.sh" \
		--exclude "install-nvm.sh" \
		--exclude "install-openssl.sh" \
		--exclude "install-playground.sh" \
		--exclude "install-porter.sh" \
		--exclude "install-protonvpn.sh" \
		--exclude "install-python3.X.sh" \
		--exclude "install-ql-plugins.sh" \
		--exclude "install-qt5-creator.sh" \
		--exclude "install-qt5.sh" \
		--exclude "install-ruby-install.sh" \
		--exclude "install-rustup" \
		--exclude "install-rustup.sh" \
		--exclude "install-sh" \
		--exclude "install-sha256sum.sh" \
		--exclude "install-shell.sh" \
		--exclude "install-sh~" \
		--exclude "install-specter-desktop.sh" \
		--exclude "install-spotify.sh" \
		--exclude "install-tree.sh" \
		--exclude "install-umbrel-dev.sh" \
		--exclude "install-vim.sh" \
		--exclude "install-youtube-dl.sh" \
		--exclude "install-ytop.sh" \
		--exclude "installer-template.sh" \
		--exclude "iterm2.json" \
		--exclude "keys.shasum.1.txt" \
		--exclude "keys.shasum.2.txt" \
		--exclude "keys.shasum.txt" \
		--exclude "keys.txt" \
		--exclude "known_hosts" \
		--exclude "legit" \
		--exclude "legit.mk" \
		--exclude "libtoolize" \
		--exclude "logs" \
		--exclude "ltmain.sh" \
		--exclude "m4" \
		--exclude "make-actions-runner.sh" \
		--exclude "missing" \
		--exclude "nigiri.sh" \
		--exclude "nostril" \
		--exclude "nostril.mk" \
		--exclude "python@2.7.18" \
		--exclude "report.sh" \
		--exclude "requirements.lock" \
		--exclude "requirements.txt" \
		--exclude "rsync-time-backup" \
		--exclude "runPiHoleDocker.sh" \
		--exclude "scripts" \
		--exclude "sources" \
		--exclude "src" \
		--exclude "tags" \
		--exclude "template" \
		--exclude "template.sh" \
		--exclude "thread-sweep.sh" \
		--exclude "uninstall-brew-all.sh" \
		--exclude "venv.mk" \
		--exclude "vimrc" \
		--exclude "weeble" \
		--exclude "whatami.sh" \
		--exclude "wobble" \
		--exclude ".git/" \
		--exclude ".github/" \
		--exclude "**.sh" \
		--exclude "**.bash" \
		--exclude "**akefile**" \
		-avh --no-perms . ~;
	source $PWD/.bashrc;
}

chmod +x ./bash_sessions
install ./bash_sessions /usr/local/bash_sessions

if [ "$1" == "force" ]; then
	doIt;
elif [ "$2" == "force" ]; then
	doIt;
else
	read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1;
	echo "";
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		doIt;
	fi;
fi;
ln -sf $PWD/known_hosts ~/.ssh/known_hosts

unset doIt;
