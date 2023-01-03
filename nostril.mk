.PHONY:nostril
nostril:## pushd nostril && $(MAKE) nostril && popd
	@pushd nostril && $(MAKE) nostril && popd
	@pushd nostril && $(MAKE) nostril install && popd
nostril-clean:## nostril-clean
	@pushd nostril && $(MAKE) clean && popd
# vim: set noexpandtab:
# vim: set setfiletype make
