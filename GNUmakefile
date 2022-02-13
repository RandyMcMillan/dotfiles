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

HOMEBREW_NO_ENV_HINTS                   :=false
export HOMEBREW_NO_ENV_HINTS


##	make :command		description
# ##make :ARGS # remove first space
.PHONY:-
.PHONY:	init
.PHONY:	help
.PHONY:	report
.SILENT:
##	 :-		default
-: report help
##	:init
init:
#	["$(shell $(SHELL))" == "/bin/zsh"] && zsh --emulate sh
#REF: https://tldp.org/LDP/abs/html/abs-guide.html#IO-REDIRECTION
	test hidutil && hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000039,"HIDKeyboardModifierMappingDst":0x700000029}]}' > /dev/null 2>&1 && echo "<Caps> = <Esc>" || echo wuh
	test ssh-agent && echo $(ssh-agent -s > /dev/null 2>&1 ) || echo wuh2
	ssh-add > /dev/null 2>&1
	ssh-add ~/.ssh/*_rsa > /dev/null 2>&1
##	:help
help:
	@echo ""
	@echo "	make                        "
	@echo "	make                        -"
	@echo "	make                        init"
	@echo "	make                        help"
	@echo "	make                        report"
	@echo "	make                        all"
	@echo "	make                        all force=true"
	@echo "	make                        bootstrap"
	@echo "	make                        executable"
	@echo "	make                        shell #alpine-shell"
	@echo "	make                        alpine-shell"
	@echo "	make                        d-shell #debian-shell"
	@echo "	make                        debian-shell"
	@echo "	make                        vim"
	@echo "	make                        config-git"
	@echo "	make                        config-github"
	@echo "	make                        adduser-git"
	@echo "	make                        install-dotfiles-on-remote"
	@echo "	remote_user=<user> remote_server=<domain/ip> make install-dotfiles-on-remote"
	@echo "	---"
	@echo "	"
	@echo "	make                        docs"
	@echo "	make                        push"
#	@echo "	make                        readme"
	@echo "	"
	@echo "	---"
	@echo "	"
	@sed -n 's/^##ARGS//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
	#@sed -n 's/^.PHONY//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
	#@sed -n 's/^.ONESHELL//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
##	:report		environment args
report:
	@echo ''
	@echo '[ARGUMENTS]	'
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
	@echo '        - HOMEBREW_NO_ENV_HINTS=${HOMEBREW_NO_ENV_HINTS}	'

#.PHONY:
#phony:
#	@sed -n 's/^.PHONY//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

.PHONY: whatami
##	:whatami		report system info
whatami:
	./whatami.sh
#.PHONY:readme
#readme:
#	make help > source/COMMANDS.md
#	git add -f README.md && git commit -m "make readme" && git push -f origin master
.PHONY:adduser-git
##	:adduser-git	add a user nameed git
adduser-git:
	./adduser-git.sh
.PHONY: bootstrap
##	:bootstrap	run bootstrap.sh - dotfile installer
bootstrap: executable
	./boot-strap.sh

.PHONY: executable
executable:
	chmod +x *.sh
.PHONY: exec
##	:executable	make shell scripts executable
exec: executable

.PHONY: checkbrew template brew
.ONESHELL:
brew: checkbrew
##	:template		base script for creating installer scripts
template: checkbrew
##	:checkbrew	source and run checkbrew command
checkbrew: executable
	bash -c "source $(PWD)/checkbrew.sh && checkbrew $(FORCE)"

.PHONY: all
##	:all	        execute installer scripts
all: executable
	bash -c "./checkbrew.sh && \
	./install-Docker.sh && \
	./install-FastLane.sh && \
	./install-OSXFuse.sh && \
	./install-Onyx.sh && \
	./install-SassC.sh && \
	./install-discord.sh && \
	./install-gpg-suite.sh && \
	./install-iterm2.sh && \
	./install-keeping-you-awake.sh && \
	./install-little-snitch.sh && \
	./install-openssl.sh && \
	./install-python3.X.sh && \
	./install-protonvpn.sh && \
	./install-ql-plugins.sh && \
	./install-qt5.sh && \
	./install-qt5-creator.sh && \
	./install-sha256sum.sh && \
	./install-vmware-fusion11.sh #Mojave && \
	./install-vypr-vpn.sh && \
	./install-youtube-dl.sh && \
	./install-ytop.sh && \
	./install-umbrel-dev.sh && \
	./install-vim.sh && \
	./install-inkscape.sh && \
	./install-dotfiles-on-remote.sh && \
	echo; exit;"

.PHONY: shell alpine alpine-shell debian debian-shell d-shell
##	:shell		run install-shell.sh script
shell: alpine-shell
##	:alpine-shell	run install-shell.sh script
alpine-shell: alpine
##	:alpine		run install-shell.sh script
alpine:
	./install-shell.sh alpine
d-shell: debian-shell
debian-shell: debian
debian:
	./install-shell.sh debian
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

.PHONY: qt
qt: executable
	./install-qt.sh
	./install-qt5-creator.sh

.PHONY: hub
hub: executable
	./install-github-utility.sh

.PHONY: config-github
config-github: executable
	cat config-git.sh
	./config-github.sh

.PHONY: install-bitcoin-libs
.ONESHELL:
##	:install-bitcoin-libs	source install-bitcoin-libs then run install-bitcoin-libs
install-bitcoin-libs: exec
	bash -c "source $(PWD)/install-bitoin-libs.sh && install-bitcoin-libs"


.PHONY: push
.ONESHELL:
push: touch-time
	bash -c "git add -f *.sh *.md sources .gitignore .bash* .vimrc .github index.html TIME *makefile && \
		git commit -m 'update from $(GIT_USER_NAME) on $(TIME)'"
	git push -f origin	+master:master

.PHONY: docs readme index
index: docs
readme: docs
docs:
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
.PHONY: install-dotfiles-on-remote
install-dotfiles-on-remote:
	./install-dotfiles-on-remote.sh

.PHONY: funcs
funcs:
	make -f funcs.mk
	cat funcs.mk

-include funcs.mk
# vim: set noexpandtab:
# vim: set setfiletype make
