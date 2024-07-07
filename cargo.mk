cargo-binstall:## 	cargo-binstall
	cargo install cargo-quickinstall && \
	cargo-quickinstall cargo-binstall
cargo-binstall-gnostr-bins:## 	cargo-binstall-gnostr-bins
	cargo install cargo-quickinstall && \
	cargo-quickinstall gnostr-bins || \
	brew tap gnostr-org/homebrew-gnostr-org && \
	brew install gnostr-bins
cargo-install-all:
	for p in $(shell cargo search gnostr -q --limit 100 | cut -d "=" -f1); do cargo install $$p;done
	cargo install cargo-sweep
