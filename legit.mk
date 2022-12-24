.PHONY:legit
legit:
	@pushd legit && $(MAKE) legit && popd
legit-clean:
	@pushd legit && $(MAKE) clean && popd
# vim: set noexpandtab:
# vim: set setfiletype make
