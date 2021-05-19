ifeq ($(notdir $(PWD)),dotfiles)
DOTFILES=:	
else
DOTFILES=:$(HOME)/dotfiles
endif
export DOTFILES

.PHONY:all
all: executable

.PHONY: bootstrap
bootstrap: executable
	./boot-strap.sh

.PHONY: executable
executable:
	chmod +x *.sh

.PHONY: brew
brew: executable
	./checkbrew.sh

.PHONY: all
all: executable
	echo docker
	./install-docker.sh
	echo alpine-shell
	./install-alpine-shell.sh
#	./install-FastLane.sh
#	./install-OSXFuse.sh
#	./install-Onyx.sh
	echo sassc
	./install-SassC.sh
	echo discord
	./install-discord.sh
#	./install-eq-mac.sh
#	./install-gpg-suite.sh
#	./install-iterm2.sh
#	./install-keeping-you-awake.sh
#	./install-little-snitch.sh
	echo openssl
	./install-openssl.sh
	echo python3.8
	./install-python3.8.sh
#	./install-ql-plugins.sh
	echo qt5
	./install-qt5.sh
	echo sha256sum
	./install-sha256sum.sh
	echo specter-desktop
	./install-specter-desktop.sh
#	./install-vmware-fusion11.sh #Mojave
#	./install-vypr-vpn.sh
	echo ytop
	./install-ytop.sh
	
	#./install-valgrind-macos.sh
#	./install-umbrel-dev.sh
	echo vim
	./install-vim.sh
.PHONY: vim
vim: executable
	./install-vim.sh

.PHONY: config-git
config-git: executable
	git config --global  pull.rebase true
.PHONY: shell
shell:
	make -C docker.shell shell
