.PHONY:legit
legit:## pushd legit && $(MAKE) legit && popd
	@pushd legit && $(MAKE) legit && popd
	@pushd legit && $(MAKE) cargo-install && popd
legit-clean:## legit-clean
	@pushd legit && $(MAKE) clean && popd
# vim: set noexpandtab:
# vim: set setfiletype make
