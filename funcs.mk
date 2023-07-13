##	:
##	:		funcs-1		additional function 1
funcs-1:##
	@echo "funcs-1"
.PHONY: install-dotfiles-on-remote
install-dotfiles-on-remote:
	./install-dotfiles-on-remote.sh
.PHONY: submodule submodules
submodule: submodules
##	:	submodules		git submodule --init --recursive
submodules:## 	submodules
	type -P git && git submodule update --init --recursive || echo
	type -P git && git submodule foreach 'git fetch origin; git submodule update --init --recursive; git clean -dfx' || echo
##	:	submodules-deinit	git submodule deinit --all -f
submodules-deinit:## 	submodules-deinit
	@type -P git && git submodule deinit --all -f

# vim: set noexpandtab:
# vim: set setfiletype make
