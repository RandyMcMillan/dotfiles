.PHONY:legit
legit:
	@pushd legit && $(MAKE) legit && popd
legit: submodule
	$(MAKE) legit -C legit

# vim: set noexpandtab:
# vim: set setfiletype make
