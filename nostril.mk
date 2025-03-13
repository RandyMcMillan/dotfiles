.PHONY:nostril
nostril:
	@pushd nostril && $(MAKE) clean all && popd
	@mkdir -p /usr/local/bin
	install nostril/nostril /usr/local/bin/ #&& $(shell which nostril)
nostril-clean:
	@rm nostril/nostril

# vim: set noexpandtab:
# vim: set setfiletype make
