cargo-install-all:
	for p in $(shell cargo search gnostr -q --limit 100 | cut -d "=" -f1); do cargo install $$p;done
	cargo install cargo-sweep
