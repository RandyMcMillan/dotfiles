.PHONY:nostril
nostril:nostril-clean## pushd nostril && $(MAKE) nostril && popd
	@sudo $(MAKE) clean -C nostril
	@pushd nostril && $(MAKE) all && popd
nostril-clean:## nostril-clean
	@sudo $(MAKE) clean -C nostril
	@pushd nostril && $(MAKE) clean && popd
# vim: set noexpandtab:
# vim: set setfiletype make
