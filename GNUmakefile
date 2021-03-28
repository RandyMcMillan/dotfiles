.PHONY:all
all:executable bootstrap
.PHONY:bootstrap
bootstrap:executable
	./boot-strap.sh
.PHONY:executable
executable:
	chmod +x *.*
.PHONY:checkbrew
checkbrew: executable
	./checkbrew.sh

.PHONY:install-all
install-all: executable
	./install-*.sh

.PHONY:config-git
config-git: executable
	git config --global  pull.rebase true

