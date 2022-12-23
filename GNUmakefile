# PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11/bin
SHELL									:= /bin/bash
POWERSHELL								:= $(shell which pwsh)
PWD										?= pwd_unknown
GLIBTOOL								:=$(shell which glibtool)
export GLIBTOOL
GLIBTOOLIZE								:=$(shell which glibtoolize)
export GLIBTOOLIZE
AUTOCONF								:=$(shell which autoconf)
export AUTOCONF
DOTFILES_PATH=$(dir $(abspath $(firstword $(MAKEFILE_LIST))))
export DOTFILES_PATH
TIME									:= $(shell date +%s)
export TIME
# PROJECT_NAME defaults to name of the current directory.
ifeq ($(project),)
PROJECT_NAME							:= $(notdir $(PWD))
else
PROJECT_NAME							:= $(project)
endif
export PROJECT_NAME

ifeq ($(force),true)
FORCE									:= --force
endif
export FORCE

#GIT CONFIG
GIT_USER_NAME							:= $(shell git config user.name)
export GIT_USER_NAME
GIT_USER_EMAIL							:= $(shell git config user.email)
export GIT_USER_EMAIL
GIT_SERVER								:= https://github.com
export GIT_SERVER
GIT_PROFILE								:= $(shell git config user.name)
export GIT_PROFILE
GIT_BRANCH								:= $(shell git rev-parse --abbrev-ref HEAD)
export GIT_BRANCH
GIT_HASH								:= $(shell git rev-parse --short HEAD)
export GIT_HASH
GIT_PREVIOUS_HASH						:= $(shell git rev-parse --short HEAD^1)
export GIT_PREVIOUS_HASH
GIT_REPO_ORIGIN							:= $(shell git remote get-url origin)
export GIT_REPO_ORIGIN
GIT_REPO_NAME							:= $(PROJECT_NAME)
export GIT_REPO_NAME
GIT_REPO_PATH							:= $(HOME)/$(GIT_REPO_NAME)
export GIT_REPO_PATH

#HOMEBREW_BREW_GIT_REMOTE=$(strip $(THIS_DIR))brew# put your Git mirror of Homebrew/brew here
#export HOMEBREW_BREW_GIT_REMOTE

#HOMEBREW_CORE_GIT_REMOTE=$(strip $(THIS_DIR))homebrew-core# put your Git mirror of Homebrew/homebrew-core here
#export HOMEBREW_CORE_GIT_REMOTE
#export HOMEBREW_INSTALL_FROM_API=1


BREW                                    := $(shell which brew)
export BREW
BREW_PREFIX                             := $(shell brew --prefix)
export BREW_PREFIX
BREW_CELLAR                             := $(shell brew --cellar)
export BREW_CELLAR
HOMEBREW_NO_ENV_HINTS                   := false
export HOMEBREW_NO_ENV_HINTS

#PORTER_VERSION                         :=v1.0.1
PORTER_VERSION                          :=latest
export PORTER_VERSION

.ONESHELL:
#.PHONY:-
.SILENT:

##make	:	command			description
##	:
-: submodules
	@$(SHELL) -c "cat $(PWD)/GNUmakefile.in > $(PWD)/GNUmakefile"
	$(MAKE) help
autoconf:
	@$(SHELL) ./autogen.sh
	@$(SHELL) ./configure
ifeq ($(BREW),)
	$(MAKE) brew
endif
	@./configure --quiet
	$(MAKE) help


##	:	-
##	:	help
##	:	report			environment args
##	:
##	:	all			execute installer scripts
##	:	init
##	:	brew
##	:	keymap

##	:
##	:	whatami			report system info
##	:
##	:	adduser-git		add a user named git

keymap:
	@mkdir -p ~/Library/LaunchAgents/
	@cat ./init/com.local.KeyRemapping.plist > ~/Library/LaunchAgents/com.local.KeyRemapping.plist
#REF: https://tldp.org/LDP/abs/html/abs-guide.html#IO-REDIRECTION
	#test hidutil && hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000039,"HIDKeyboardModifierMappingDst":0x700000029}]}' > /dev/null 2>&1 && echo "<Caps> = <Esc>" || echo wuh

init:-
	#["$(shell $(SHELL))" == "/bin/zsh"] && zsh --emulate sh
	["$(shell $(SHELL))" == "/bin/zsh"] && chsh -s /bin/bash
brew:-
	@export HOMEBREW_INSTALL_FROM_API=1
	@bash ./install-brew.sh
iterm:
	@rm -rf /Applications/iTerm.app
	test brew && brew install -f --cask iterm2 && \
		curl -L https://iterm2.com/shell_integration/install_shell_integration_and_utilities.sh | bash
help:
	@echo ''
	@sed -n 's/^##ARGS//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
	# @sed -n 's/^.PHONY//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
	@echo ""
	@echo "Useful Commands:"
	@echo ""
	@echo "git-\<TAB>";
	@echo "gpg-\<TAB>";
	@echo "bitcoin-\<TAB>";
	@echo ""

report:
	@echo ''
	@echo ' GLIBTOOL=${GLIBTOOL}	'
	@echo ' GLIBTOOLIZE=${GLIBTOOLIZE}	'
	@echo ' AUTOCONF=${AUTOCONF}	'
	@echo ''
	@echo ' TIME=${TIME}	'
	@echo ' SHELL=${SHELL}	'
	@echo ' POWERSHELL=${POWERSHELL}	'
	@echo ' DOTFILES_PATH=${DOTFILES_PATH}	'
	@echo ' PROJECT_NAME=${PROJECT_NAME}	'
	@echo ' GIT_USER_NAME=${GIT_USER_NAME}	'
	@echo ' GIT_USER_EMAIL=${GIT_USER_EMAIL}	'
	@echo ' GIT_SERVER=${GIT_SERVER}	'
	@echo ' GIT_PROFILE=${GIT_PROFILE}	'
	@echo ' GIT_BRANCH=${GIT_BRANCH}	'
	@echo ' GIT_HASH=${GIT_HASH}	'
	@echo ' GIT_PREVIOUS_HASH=${GIT_PREVIOUS_HASH}	'
	@echo ' GIT_REPO_ORIGIN=${GIT_REPO_ORIGIN}	'
	@echo ' GIT_REPO_NAME=${GIT_REPO_NAME}	'
	@echo ' GIT_REPO_PATH=${GIT_REPO_PATH}	'
	@echo ' BREW=${BREW}	'
	@echo ' HOMEBREW_BREW_GIT_REMOTE=${HOMEBREW_BREW_GIT_REMOTE}	'
	@echo ' HOMEBREW_CORE_REMOTE=${HOMEBREW_CORE_GIT_REMOTE}	'
	@echo ' HOMEBREW_INSTALL_FROM_API=${HOMEBREW_INSTALL_FROM_API}	'
	@echo ' BREW_PREFIX=${BREW_PREFIX}	'
	@echo ' BREW_CELLAR=${BREW_CELLAR}	'
	@echo ' HOMEBREW_NO_ENV_HINTS=${HOMEBREW_NO_ENV_HINTS}	'
	@echo ''
	@echo ' PORT_VERSION=${PORTER_VERSION}	'

#.PHONY:
#phony:
#	@sed -n 's/^.PHONY//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

whatami:
	@bash ./whatami.sh
#.PHONY:readme
#readme:
#	make help > source/COMMANDS.md
#	git add -f README.md && git commit -m "make readme" && git push -f origin master
.PHONY: adduser-git
##	:	adduser-git		add a user named git
adduser-git:
	source $(PWD)/adduser-git.sh && adduser-git


##	:	bootstrap		source bootstrap.sh
.PHONY: bootstrap
bootstrap: exec
	bash -c "$(PWD)/./bootstrap.sh"


.PHONY: install
##	:	install		 	install sequence
install: executable
	@echo "install sequence here..."


.PHONY: github
##	:	github		 	config-github
github: executable
	@./config-github




.PHONY: executable
executable:
	chmod +x *.sh
.PHONY: exec
##	:	executable		make shell scripts executable
exec: executable

.PHONY: template
.ONESHELL:
template:
##	:	template		install checkbrew command
	rm -f /usr/local/bin/checkbrew
	@install -bC $(PWD)/template /usr/local/bin/checkbrew
	bash -c "source /usr/local/bin/checkbrew"

.PHONY: nvm
##	:	nvm		 	install node version manager
nvm: executable
	@echo "install sequence here..."
	@curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
	@wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
#	@export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "$(HOME)/.nvm" || printf %s "$(XDG_CONFIG_HOME)/nvm")"
#	@[ -s "$(NVM_DIR)/nvm.sh" ] && \. "$(NVM_DIR)/nvm.sh" # This loads nvm

##	:	cirrus			source and run install-cirrus command
cirrus: executable
	bash -c "source $(PWD)/install-cirrus.sh && install-cirrus $(FORCE)"
##	:	config-dock		source and run config-dock-prefs
config-dock: executable
	bash -c "source $(PWD)/config-dock-prefs.sh && brew-install-dockutils && config-dock-prefs $(FORCE)"

.PHONY: all
##	:	all			execute checkbrew install scripts
all: executable gnupg
	bash -c "source $(PWD)/template && checkbrew install vim"
	bash -c "source $(PWD)/template && checkbrew install     macdown"
	bash -c "source $(PWD)/template && checkbrew install             glow"
	bash -c "source $(PWD)/template && checkbrew install coreutils"
	bash -c "source $(PWD)/template && checkbrew install           gettext"
	bash -c "source $(PWD)/template && checkbrew install gnutls"
	bash -c "source $(PWD)/template && checkbrew install        libassuan"
	bash -c "source $(PWD)/template && checkbrew install libgcrypt"
	bash -c "source $(PWD)/template && checkbrew install           libgpg-error"
	bash -c "source $(PWD)/template && checkbrew install libksba"
	bash -c "source $(PWD)/template && checkbrew install         libusb"
	bash -c "source $(PWD)/template && checkbrew install                npth"
	bash -c "source $(PWD)/template && checkbrew install pinentry"
	bash -c "source $(PWD)/template && checkbrew install          gnupg"
	bash -c "source $(PWD)/template && checkbrew install                gdbm"
	bash -c "source $(PWD)/template && checkbrew install mpdecimal"
	bash -c "source $(PWD)/template && checkbrew install           openssl@1.1"
	bash -c "source $(PWD)/template && checkbrew install readline"
	bash -c "source $(PWD)/template && checkbrew install          sqlite"
	bash -c "source $(PWD)/template && checkbrew install xz"
	bash -c "source $(PWD)/template && checkbrew install    python@3.10"
	bash -c "source $(PWD)/template && checkbrew install node"
	bash -c "source $(PWD)/template && checkbrew install      yarn"
	bash -c "source $(PWD)/template && checkbrew install vim"
	bash -c "source $(PWD)/template && checkbrew install     powershell"
	bash -c "source $(PWD)/template && checkbrew install                meson"
	bash -c "source $(PWD)/template && checkbrew install texi2html ffmpeg@2.8"

gnupg:- executable
	bash -c "source $(PWD)/template && \
		checkbrew install gettext gnutls \
		libassuan libgcrypt libgpg-error \
		libksba libusb npth pinentry gnupg"

gpg-recv-keys-bitcoin-devs:
	@. .functions &&  gpg-recv-keys-bitcoin-devs
# bash -c "test docker-compose && brew unlink docker-completion || echo"
# bash -c "source template.sh && checkbrew install --cask docker"

# 	./install-Docker.sh && \
# 	./install-FastLane.sh && \
# 	./install-Onyx.sh && \
# 	./install-SassC.sh && \
# 	./install-discord.sh && \
# 	./install-gnupg+suite.sh && \
# 	./install-iterm2.sh && \
# 	./install-keeping-you-awake.sh && \
# 	./install-little-snitch.sh && \
# 	./install-openssl.sh && \
# 	./install-python3.X.sh && \
# 	./install-protonvpn.sh && \
# 	./install-ql-plugins.sh && \
# 	./install-qt5.sh && \
# 	./install-qt5-creator.sh && \
# 	./install-sha256sum.sh && \
# 	./install-vmware-fusion11.sh #Mojave && \
# 	./install-vypr-vpn.sh && \
# 	./install-youtube-dl.sh && \
# 	./install-ytop.sh && \
# 	./install-umbrel-dev.sh && \
# 	./install-vim.sh && \
# 	./install-inkscape.sh && \
# 	./install-dotfiles-on-remote.sh && \
	echo; exit;"

.PHONY: shell alpine alpine-shell debian debian-shell d-shell
shell: alpine-shell
##	:	alpine-shell		run install-shell.sh alpine user=root
alpine-shell: alpine
alpine:
	test docker && ./install-shell.sh alpine || echo "make docker OR checkbrew -i docker"
##	:	alpine-build		run install-shell.sh alpine-build user=root
alpine-build:
	test docker && ./install-shell.sh alpine-build || echo "make docker OR checkbrew -i docker"
d-shell: debian-shell
##	:	debian-shell		run install-shell.sh debian user=root
debian-shell: debian
debian:
	test docker && ./install-shell.sh debian || echo "make docker OR checkbrew -i docker"
	./install-shell.sh debian

##	:	porter
porter:
	@curl -L https://cdn.porter.sh/$(PORTER_VERSION)/install-mac.sh > install-porter.sh \
	&& chmod +x install-porter.sh && ./install-porter.sh \
	&& export PATH=$(PATH):~/.porter

.PHONY: vim
##	:	vim			install vim and macvim on macos
vim: executable
	./install-vim.sh $(FORCE)

.PHONY: protonvpn
protonvpn: executable
	./install-protonvpn.sh $(FORCE)

.PHONY: config-git
config-git: executable
	$(DOTFILES_PATH)/./config-git

.PHONY: qt5
##	:	qt5			install qt@5
qt5: executable
	$(DOTFILES_PATH)/./install-qt5.sh
	$(DOTFILES_PATH)/./install-qt5-creator.sh

.PHONY: hub
hub: executable
	$(DOTFILES_PATH)/./install-github-utility.sh

.PHONY: config-github
config-github: executable
	$(DOTFILES_PATH)/./config-github

.PHONY: bitcoin-libs
.ONESHELL:
##	:
##	:	bitcoin-libs		install bitcoin-libs
bitcoin-libs: exec
	bash -c "source $(PWD)/bitcoin-libs && install-bitcoin-libs"
.PHONY: bitcoin-depends
.ONESHELL:
##	:	bitcoin-depends		make depends from bitcoin repo
bitcoin-depends: exec bitcoin-libs
	@test brew && brew install autoconf automake libtool pkg-config || echo "make brew && make bitcoin-depends"
	@brew install autoconf || echo "make brew && brew install autoconf"
	@rm -rf ./bitcoin
	@git clone --filter=blob:none https://github.com/bitcoin/bitcoin.git && \
		cd ./bitcoin && ./autogen.sh && ./configure && $(MAKE) -C depends
bitcoin-guix-sigs:
	@if [[ ! -d "guix.sigs" ]]; then git clone git@github.com:randymcmillan/guix.sigs.git; fi
	@pushd guix.sigs && git reset --hard && git remote -v | grep -w upstream && \
	git remote set-url upstream https://github.com/bitcoin-core/guix.sigs.git || \
	git remote add     upstream https://github.com/bitcoin-core/guix.sigs.git && \
	git push -f origin main:main && popd
.PHONY: push
.ONESHELL:
push: touch-time
	bash -c "git add -f *.sh *.md sources .gitignore .bash* .vimrc .github index.html TIME *makefile && \
		git commit -m 'update from $(GIT_USER_NAME) on $(TIME)'"
	git push -f origin	+master:master

.PHONY: docs readme index
index: docs
readme: docs
docs:-
	@echo 'docs'
	bash -c "if pgrep MacDown; then pkill MacDown; fi"
	bash -c "make help > $(PWD)/sources/COMMANDS.md"
	bash -c 'cat $(PWD)/sources/HEADER.md                >  $(PWD)/README.md'
	bash -c 'cat $(PWD)/sources/COMMANDS.md              >> $(PWD)/README.md'
	bash -c 'cat $(PWD)/sources/FOOTER.md                >> $(PWD)/README.md'
	#bash -c "if hash open 2>/dev/null; then open README.md; fi || echo failed to open README.md"
	#brew install pandoc
	bash -c "if hash pandoc 2>/dev/null; then echo; fi || brew install pandoc"
	#bash -c 'pandoc -s README.md -o index.html  --metadata title="$(GH_USER_SPECIAL_REPO)" '
	bash -c 'pandoc -s README.md -o index.html'
	#bash -c "if hash open 2>/dev/null; then open README.md; fi || echo failed to open README.md"
	git add --ignore-errors sources/*.md
	git add --ignore-errors *.md
	#git ls-files -co --exclude-standard | grep '\.md/$\' | xargs git

.PHONY: touch-time
.ONESHELL:
touch-time:
	#rm -f 1618*
	#$(shell git rm -f 1618*)
	touch TIME
	echo $(TIME) $(shell git rev-parse HEAD) >> TIME

ifeq ($(bitcoin-version),)
	@echo Example:
	@echo add tag v22.0rc3
BITCOIN_VERSION:=v22.0rc3
else
BITCOIN_VERSION:=$(bitcoin-version)
endif
export BITCOIN_VERSION
.PHONY: bitcoin-test-battery
bitcoin-test-battery:
	bash -c "./bitcoin-test-battery.sh $(BITCOIN_VERSION) "

.PHONY: funcs
##	:
##	:	funcs			additional make functions
funcs:
	make -f funcs.mk

-include funcs.mk
-include legit.mk
-include nostril.mk
# vim: set noexpandtab:
# vim: set setfiletype make
