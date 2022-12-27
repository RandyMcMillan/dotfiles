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
THIS_FILE								:= $(lastword $(MAKEFILE_LIST))
export THIS_FILE
TIME									:= $(shell date +%s)
export TIME

ARCH                                    :=$(shell uname -m)
export ARCH
ifeq ($(ARCH),x86_64)
TRIPLET                                 :=x86_64-linux-gnu
export TRIPLET
endif
ifeq ($(ARCH),arm64)
TRIPLET                                 :=aarch64-linux-gnu
export TRIPLET
endif

NODE_VERSION							:=v12.22.9
export NODE_VERSION
NODE_ALIAS								:=v14
export NODE_ALIAS
PACKAGE_MANAGER							:=yarn
export PACKAGE_MANAGER
PACKAGE_INSTALL							:=add
export PACKAGE_INSTALL

ifeq ($(docker),)
DOCKER							        := $(shell which docker)
else
DOCKER   							    := $(docker)
endif
export DOCKER

ifeq ($(compose),)
DOCKER_COMPOSE						    := $(shell which docker-compose)
else
DOCKER_COMPOSE							:= $(compose)
endif
export DOCKER_COMPOSE
ifeq ($(reset),true)
RESET:=true
else
RESET:=false
endif
export RESET

PYTHON                                  := $(shell which python)
export PYTHON
PYTHON2                                 := $(shell which python2)
export PYTHON2
PYTHON3                                 := $(shell which python3)
export PYTHON3

PIP                                     := $(shell which pip)
export PIP
PIP2                                    := $(shell which pip2)
export PIP2
PIP3                                    := $(shell which pip3)
export PIP3

python_version_full := $(wordlist 2,4,$(subst ., ,$(shell python3 --version 2>&1)))
python_version_major := $(word 1,${python_version_full})
python_version_minor := $(word 2,${python_version_full})
python_version_patch := $(word 3,${python_version_full})

my_cmd.python.3 := $(PYTHON3) some_script.py3
my_cmd := ${my_cmd.python.${python_version_major}}

PYTHON_VERSION                         := ${python_version_major}.${python_version_minor}.${python_version_patch}
PYTHON_VERSION_MAJOR                   := ${python_version_major}
PYTHON_VERSION_MINOR                   := ${python_version_minor}

export python_version_major
export python_version_minor
export python_version_patch
export PYTHON_VERSION

#PROJECT_NAME defaults to name of the current directory.
ifeq ($(project),)
PROJECT_NAME							:= $(notdir $(PWD))
else
PROJECT_NAME							:= $(project)
endif
export PROJECT_NAME

#GIT CONFIG
GIT_USER_NAME							:= $(shell git config user.name || echo)
export GIT_USER_NAME
GIT_USER_EMAIL							:= $(shell git config user.email || echo)
export GIT_USER_EMAIL
GIT_SERVER								:= https://github.com
export GIT_SERVER
GIT_PROFILE								:= $(shell git config user.name || echo)
export GIT_PROFILE
GIT_BRANCH								:= $(shell git rev-parse --abbrev-ref HEAD || echo)
export GIT_BRANCH
GIT_HASH								:= $(shell git rev-parse --short HEAD || echo)
export GIT_HASH
GIT_PREVIOUS_HASH						:= $(shell git rev-parse --short HEAD^1 || echo)
export GIT_PREVIOUS_HASH
GIT_REPO_ORIGIN							:= $(shell git remote get-url origin || echo)
export GIT_REPO_ORIGIN
GIT_REPO_NAME							:= $(PROJECT_NAME)
export GIT_REPO_NAME
GIT_REPO_PATH							:= $(HOME)/$(GIT_REPO_NAME)
export GIT_REPO_PATH

ifneq ($(bitcoin-datadir),)
BITCOIN_DATA_DIR						:= $(bitcoin-datadir)
else
BITCOIN_DATA_DIR						:= $(HOME)/.bitcoin
endif
export BITCOIN_DATA_DIR

ifeq ($(nocache),true)
NOCACHE					     			:= --no-cache
#Force parallel build when --no-cache to speed up build
PARALLEL                                := --parallel
else
NOCACHE						    		:=
PARALLEL                                :=
endif
ifeq ($(parallel),true)
PARALLEL                                := --parallel
endif
ifeq ($(para),true)
PARALLEL                                := --parallel
endif
export NOCACHE
export PARALLEL

ifeq ($(verbose),true)
VERBOSE									:= --verbose
else
VERBOSE									:=
endif
export VERBOSE

BREW                                    := $(shell which brew || echo)
export BREW
BREW_PREFIX                             := $(shell brew --prefix || echo)
export BREW_PREFIX
BREW_CELLAR                             := $(shell brew --cellar || echo)
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
-: submodules## - default
	@$(SHELL) -c "cat $(PWD)/GNUmakefile.in > $(PWD)/GNUmakefile"
	#NOTE: 2 hashes are detected as 1st column output with color
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?##/ {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
autoconf:## ./autogen.sh && ./configure
	@$(SHELL) ./autogen.sh
	@$(SHELL) ./configure
ifeq ($(BREW),)
	$(MAKE) brew
endif
	@./configure --quiet
	$(MAKE) -


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

keymap:## install ./init/com.local.KeyRemapping.plist
	@mkdir -p ~/Library/LaunchAgents/
	@cat ./init/com.local.KeyRemapping.plist > ~/Library/LaunchAgents/com.local.KeyRemapping.plist
#REF: https://tldp.org/LDP/abs/html/abs-guide.html#IO-REDIRECTION
	#test hidutil && hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000039,"HIDKeyboardModifierMappingDst":0x700000029}]}' > /dev/null 2>&1 && echo "<Caps> = <Esc>" || echo wuh

init:-## chsh -s /bin/bash && ./scripts/initialize
	#["$(shell $(SHELL))" == "/bin/zsh"] && zsh --emulate sh
	["$(shell $(SHELL))" == "/bin/zsh"] && chsh -s /bin/bash
	./scripts/initialize
brew:-## bash ./install-brew.sh
	@export HOMEBREW_INSTALL_FROM_API=1
	@bash ./install-brew.sh
iterm:## brew install --cask iterm2
	@rm -rf /Applications/iTerm.app
	test brew && brew install -f --cask iterm2 && \
		curl -L https://iterm2.com/shell_integration/install_shell_integration_and_utilities.sh | bash

.PHONY: help
help:## print verbose help
	@echo 'make [COMMAND] [EXTRA_ARGUMENTS]	'
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
	@echo '	[DEV ENVIRONMENT]:	'
	@echo ''
	@echo ' TIME=${TIME}	'
	@echo ' SHELL=${SHELL}	'
	@echo ' POWERSHELL=${POWERSHELL}	'
	@echo ' DOTFILES_PATH=${DOTFILES_PATH}	'
	@echo ' PROJECT_NAME=${PROJECT_NAME}	'
	@echo ''
	@echo ' NODE_VERSION=${NODE_VERSION}	'
	@echo ' NODE_ALIAS=${NODE_ALIAS}	'
	@echo ''
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
	@echo ''
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
.ONESHELL:
nvm: executable ## nvm
	@curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash || git pull -C $(HOME)/.nvm && export NVM_DIR="$(HOME)/.nvm" && [ -s "$(NVM_DIR)/nvm.sh" ] && \. "$(NVM_DIR)/nvm.sh" && [ -s "$(NVM_DIR)/bash_completion" ] && \. "$(NVM_DIR)/bash_completion"  && nvm install $(NODE_VERSION) && nvm use $(NODE_VERSION)
	@source ~/.bashrc && nvm alias $(NODE_ALIAS) $(NODE_VERSION)

##	:	cirrus			source and run install-cirrus command
cirrus: executable
	bash -c "source $(PWD)/install-cirrus.sh && install-cirrus $(FORCE)"
##	:	config-dock		source and run config-dock-prefs
config-dock: executable
	bash -c "source $(PWD)/config-dock-prefs.sh && brew-install-dockutils && config-dock-prefs $(FORCE)"

.PHONY: all
##	:	all			exec gnupg brew-libs
all: executable gnupg brew-libs
vim:## vim - install-vim.sh
	bash -c "source $(PWD)/template && checkbrew install	vim"
	./install-vim.sh
macdown:
	bash -c "source $(PWD)/template && checkbrew install	macdown"
glow:
	bash -c "source $(PWD)/template && checkbrew install	glow"
coreutils:
	bash -c "source $(PWD)/template && checkbrew install	coreutils"
gettext:
	bash -c "source $(PWD)/template && checkbrew install	gettext"
texinfo:
	bash -c "source $(PWD)/template && checkbrew install	texinfo"
help2man:
	bash -c "source $(PWD)/template && checkbrew install	help2man"
gnutls:
	bash -c "source $(PWD)/template && checkbrew install	gnutls"

brew-libs: libassuan libgcrypt libgpg-error libksba libusb
libassuan:
	bash -c "source $(PWD)/template && checkbrew install	libassuan"
libgcrypt:
	bash -c "source $(PWD)/template && checkbrew install	libgcrypt"
libgpg-error:
	bash -c "source $(PWD)/template && checkbrew install	libgpg-error"
libksba:
	bash -c "source $(PWD)/template && checkbrew install	libksba"
libusb:
	bash -c "source $(PWD)/template && checkbrew install	libusb"

npth:
	bash -c "source $(PWD)/template && checkbrew install                npth"
pinentry:
	bash -c "source $(PWD)/template && checkbrew install pinentry"
gdbm:
	bash -c "source $(PWD)/template && checkbrew install                gdbm"
mpdecimal:
	bash -c "source $(PWD)/template && checkbrew install mpdecimal"
openssl@1.1:
	bash -c "source $(PWD)/template && checkbrew install           openssl@1.1"
readline:
	bash -c "source $(PWD)/template && checkbrew install readline"
sqlite:
	bash -c "source $(PWD)/template && checkbrew install          sqlite"
xz:
	bash -c "source $(PWD)/template && checkbrew install xz"
python@3.10:
	bash -c "source $(PWD)/template && checkbrew install    python@3.10"
node:
	bash -c "source $(PWD)/template && checkbrew install node"
node@18:
	bash -c "source $(PWD)/template && checkbrew install node@18"
yarn:
	bash -c "source $(PWD)/template && checkbrew install      yarn"
powershell:
	bash -c "source $(PWD)/template && checkbrew install     powershell"
meson:
	bash -c "source $(PWD)/template && checkbrew install                meson"
texi2html:
	bash -c "source $(PWD)/template && checkbrew install texi2html"
ffmpeg@2.8:
	bash -c "source $(PWD)/template && checkbrew install ffmpeg@2.8"

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
##	:	install-vim			install vim and macvim on macos
install-vim: executable
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

clean-nvm: ## clean-nvm
	@rm -rf ~/.nvm

-include funcs.mk
-include legit.mk
-include nostril.mk
# vim: set noexpandtab:
# vim: set setfiletype make
