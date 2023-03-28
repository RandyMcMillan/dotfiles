rust-help:## rust-help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?##/ {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
rust-bootstrap:## rust-bootstrap
	@pushd rust && python3  /Users/Shared/randymcmillan/dotfiles/rust/x.py --help && popd




# vim: set noexpandtab:
# vim: set setfiletype make
