.PHONY:nostril
nostril:
	@git submodule update --init --reference $@ --recursive
	@pushd nostril && $(MAKE) nostril && popd
	#@pushd nostril && $(MAKE) nostril install && popd
nostril-clean:
	@make clean -C nostril/

# vim: set noexpandtab:
# vim: set setfiletype make
