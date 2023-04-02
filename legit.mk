legit-help:## 	legit commands
	@awk 'BEGIN {FS = ":.*?## 	"} /^[a-zA-Z_-]+:.*?## 	/ {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	#@echo "more legit command help"
legit-install:## 	pushd legit && $(MAKE) legit && popd
	@pushd legit && $(MAKE) legit && popd
	@pushd legit && $(MAKE) cargo-install && popd
legit-clean:## 	legit-clean
	@pushd legit && $(MAKE) clean && popd
# vim: set noexpandtab:
# vim: set setfiletype make
