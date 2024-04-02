.PHONY:nostril
nostril:
	@pushd nostril && $(MAKE) install && popd
nostril-clean:
	@$(MAKE) clean -C nostril/

# vim: set noexpandtab:
# vim: set setfiletype make
