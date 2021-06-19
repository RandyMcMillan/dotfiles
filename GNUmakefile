.PHONY:all
all: executable

.PHONY: bootstrap
bootstrap: executable
	./boot-strap.sh

.PHONY: executable
executable:
	chmod +x *.sh

.PHONY: exec
exec: executable

.PHONY: brew
brew: executable
	./checkbrew.sh

.PHONY: all
all: executable
	./install-Docker.sh
	./install-alpine-shell.sh
	./install-FastLane.sh
	./install-OSXFuse.sh
	./install-Onyx.sh
	./install-SassC.sh
	./install-discord.sh
	./install-eq-mac.sh
	./install-gpg-suite.sh
	./install-iterm2.sh
	./install-keeping-you-awake.sh
	./install-little-snitch.sh
	./install-openssl.sh
	./install-python3.X.sh
	./install-ql-plugins.sh
	./install-qt5.sh
	./install-sha256sum.sh
	./install-specter-desktop.sh
	./install-vmware-fusion11.sh #Mojave
	./install-vypr-vpn.sh
	./install-youtube-dl.sh
	./install-ytop.sh
	
	#./install-valgrind-macos.sh
	./install-umbrel-dev.sh
	./install-vim.sh
.PHONY: vim
vim: executable
	./install-Vim.sh

.PHONY: config-git
config-git: executable
	git config --global  pull.rebase true
.PHONY: shell
shell:
	make -C docker.shell shell
