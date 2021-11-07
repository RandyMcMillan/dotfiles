SHELL                                   := /bin/bash

PWD 									?= pwd_unknown

TIME 									:= $(shell date +%s)
export TIME

# PROJECT_NAME defaults to name of the current directory.
ifeq ($(project),)
PROJECT_NAME							:= $(notdir $(PWD))
else
PROJECT_NAME							:= $(project)
endif
export PROJECT_NAME

ifeq ($(force),true)
FORCE                                   := --force
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
GIT_PREVIOUS_HASH						:= $(shell git rev-parse --short master@{1})
export GIT_PREVIOUS_HASH
GIT_REPO_ORIGIN							:= $(shell git remote get-url origin)
export GIT_REPO_ORIGIN
GIT_REPO_NAME							:= $(PROJECT_NAME)
export GIT_REPO_NAME
GIT_REPO_PATH							:= $(HOME)/$(GIT_REPO_NAME)
export GIT_REPO_PATH

.PHONY:-
.SILENT:
-: help
	#REF: https://tldp.org/LDP/abs/html/abs-guide.html#IO-REDIRECTION
	hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000039,"HIDKeyboardModifierMappingDst":0x700000029}]}' > /dev/null
.PHONY: help
help: report
	@echo ""
	@echo "	make all	"
	@echo "	make bootstrap	"
	@echo "	make executable	"
	@echo "	make alpine-shell	"
	@echo "	make shell	"
	@echo "	make vim	"
	@echo "	make config-git	"
	@echo "	make config-github	"
	@echo "	make push	"
	@echo "	make readme	"
	@echo "	"
	@echo "	make all force=true	"

.PHONY: report
report: 
	@echo ''
	@echo '	[ARGUMENTS]	'
	@echo '      args:	'
	@echo '        - TIME=${TIME}	'
	@echo '        - PROJECT_NAME=${PROJECT_NAME}	'
	@echo '        - GIT_USER_NAME=${GIT_USER_NAME}	'
	@echo '        - GIT_USER_EMAIL=${GIT_USER_EMAIL}	'
	@echo '        - GIT_SERVER=${GIT_SERVER}	'
	@echo '        - GIT_PROFILE=${GIT_PROFILE}	'
	@echo '        - GIT_BRANCH=${GIT_BRANCH}	'
	@echo '        - GIT_HASH=${GIT_HASH}	'
	@echo '        - GIT_PREVIOUS_HASH=${GIT_PREVIOUS_HASH}	'
	@echo '        - GIT_REPO_ORIGIN=${GIT_REPO_ORIGIN}	'
	@echo '        - GIT_REPO_NAME=${GIT_REPO_NAME}	'
	@echo '        - GIT_REPO_PATH=${GIT_REPO_PATH}	'

.PHONY:readme
readme:
	make help > README.md
	git add -f README.md && git commit -m "make readme" && git push -f origin master

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
	./checkbrew.sh $(FORCE)

.PHONY: all
all: executable
	#./install-Bash+Utils.bash
	./checkbrew.sh
	#./install-firefox.sh $(FORCE)
	./install-Docker.sh
	./install-FastLane.sh
	./install-OSXFuse.sh
	./install-Onyx.sh
	./install-SassC.sh
	./install-discord.sh
	#./install-eq-mac.sh
	./install-gpg-suite.sh
	./install-iterm2.sh
	./install-keeping-you-awake.sh
	./install-little-snitch.sh
	y | ./install-openssl.sh
	./install-python3.X.sh
	./install-protonvpn.sh
	./install-ql-plugins.sh
	./install-qt5.sh
	./install-sha256sum.sh
	#./install-specter-desktop.sh
	./install-vmware-fusion11.sh #Mojave
	./install-vypr-vpn.sh
	./install-youtube-dl.sh
	./install-ytop.sh
	#./install-valgrind-macos.sh
	./install-umbrel-dev.sh
	./install-vim.sh

.PHONY: shell
shell:
	bash -c "make alpine-shell"

.PHONY:
alpine-shell:
	./install-alpine-shell.sh
	cd ~ && make -f ~/GNUmakefile alpine-build &&  make -f ~/GNUmakefile shell

.PHONY: vim
vim: executable
	./install-vim.sh $(FORCE)

.PHONY: protonvpn
protonvpn: executable
	./install-protonvpn.sh $(FORCE)

.PHONY: config-git
config-git: executable
	cat config-git.sh
	./config-git.sh
.PHONY: config-github
config-github: executable
	cat config-git.sh
	./config-github.sh

.PHONY: push
.ONESHELL:
push: touch-time
	bash -c "git add -f * .gitignore .bash* .vimrc .github && \
		git commit -m 'update from $(GIT_USER_NAME) on $(TIME)'"
	git push -f origin	+master:master

.PHONY: docs
docs:
	@echo 'docs'
	bash -c "if pgrep MacDown; then pkill MacDown; fi"
	bash -c 'cat $(PWD)/HEADER.md                >  $(PWD)/README.md'
	bash -c 'cat $(PWD)/COMMANDS.md              >> $(PWD)/README.md'
	bash -c 'cat $(PWD)/FOOTER.md                >> $(PWD)/README.md'
	bash -c "if hash open 2>/dev/null; then open README.md; fi || echo failed to open README.md"


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

