rust-help:## rust-help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?##/ {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
rust-bootstrap:## rust-bootstrap
	@pushd rust && python3  /Users/Shared/randymcmillan/dotfiles/rust/x.py --help && popd
rust-x:## rust rust-x
	@pushd rust && ./x && popd
rust-x-build:## rust rust-x-build
	@pushd rust && ./x build && popd
rust-x-check:## rust rust-x-check
	@pushd rust && ./x check && popd
rust-x-fix:## rust rust-x-fix
	@pushd rust && ./x fix && popd
rust-x-fmt:## rust rust-x-fmt
	@pushd rust && ./x fmt && popd
rust-x-test:## rust rust-x-test
	@pushd rust && ./x test && popd
rust-x-bench:## rust rust-x-bench
	@pushd rust && ./x bench && popd
rust-x-doc:## rust rust-x-doc
	@pushd rust && ./x doc && popd
rust-x-clean:## rust rust-x-clean
	@pushd rust && ./x clean && popd
rust-x-dist:## rust rust-x-dist
	@pushd rust && ./x dist && popd
rust-x-install:## rust rust-x-install
	@pushd rust && ./x install && popd
rust-x-run:## rust rust-x-run
	@pushd rust && ./x run && popd
rust-x-setup:## rust rust-x-setup
	@pushd rust && ./x setup && popd

# vim: set noexpandtab:
# vim: set setfiletype make
