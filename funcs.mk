##	:
##	:		funcs-1		additional function 1
funcs-1:
	@echo "funcs-1"
.PHONY: install-dotfiles-on-remote
install-dotfiles-on-remote:
	./install-dotfiles-on-remote.sh
.PHONY: submodule submodules
submodule: submodules
##	:	submodules		git submodule --init --recursive
submodules:
	git submodule update --init --recursive
	git submodule foreach 'git fetch origin; git checkout $$(git rev-parse --abbrev-ref HEAD); git reset --hard origin/$$(git rev-parse --abbrev-ref HEAD); git submodule update --recursive; git clean -dfx'
##	:	submodules-deinit	git submodule deinit --all -f
submodules-deinit:
	@git submodule deinit --all -f

# vim: set noexpandtab:
# vim: set setfiletype make
