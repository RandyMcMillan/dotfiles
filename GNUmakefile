.PHONY:all
all:executable bootstrap

.PHONY: bootstrap
bootstrap: executable
	./boot-strap.sh

.PHONY: executable
executable:
	chmod +x *.*

.PHONY: brew
brew: executable
	./checkbrew.sh

.PHONY: all
all: executable
	./install-*.sh

.PHONY: vim
vim: executable
	./install-Vim.sh

.PHONY: config-git
config-git: executable
	git config --global  pull.rebase true

