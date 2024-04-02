.PHONY:nostril
nostril:
	@pushd nostril && $(MAKE) install && popd
nostril-clean:
	@rm nostril/nostril

# vim: set noexpandtab:
# vim: set setfiletype make
