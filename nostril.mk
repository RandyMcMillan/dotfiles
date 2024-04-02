.PHONY:nostril
nostril:
	@pushd nostril && git submodule update --init --recursive && make nostril && \
		make install || true
nostril-clean:
	#@make clean -C nostril/

# vim: set noexpandtab:
# vim: set setfiletype make
