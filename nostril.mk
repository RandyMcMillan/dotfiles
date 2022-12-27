.PHONY:nostril
nostril:## pushd nostril && $(MAKE) nostril && popd
	@pushd nostril && $(MAKE) nostril && popd
	@pushd nostril && $(MAKE) nostril install && popd
# vim: set noexpandtab:
# vim: set setfiletype make
