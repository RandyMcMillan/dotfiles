.PHONY:legit
legit:
	@pushd legit && $(MAKE) legit && popd
legit: submodule
	@pushd legit && $(MAKE) legit && popd
# vim: set noexpandtab:
# vim: set setfiletype make
