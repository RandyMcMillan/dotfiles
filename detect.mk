detect:## 	install sequence got Darwin and Linux
##detect
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && type -P brew >/tmp/gnostr.log && \
		export LIBRARY_PATH='$(LIBRARY_PATH):$(brew --prefix)/lib' || echo"
##	detect uname -s uname -m uname -p and install sequence

## 	Darwin
ifneq ($(shell id -u),0)
	@echo
	@echo $(shell id -u -n) 'not root'
	@echo
endif
	#bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew update                     || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install autoconf            || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install automake            || echo "
##	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install boost               || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install cmake --cask        || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install coreutils           || echo "
	#bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install --cask docker       || echo "
	#bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install gcc                || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install expat               || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install gettext             || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install git-archive-all     || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install git-gui             || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install glib-openssl        || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install golang              || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install libtool             || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install mercurial           || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install node@14             || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install pandoc              || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install pkg-config          || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install python3             || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install rustup              || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install secp256k1           || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install virtualenv          || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew link --overwrite virtualenv || echo "
	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install zlib                || echo "
	#bash -c "[ '$(shell uname -s)' == 'Darwin' ] && /Applications/Docker.app/Contents/Resources/bin/docker system info || echo "







## 	Linux
ifneq ($(shell id -u),0)
	@echo
	@echo $(shell id -u -n) 'not root'
	@echo
endif
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && type -P brew >/tmp/gnostr.log && \
		export LIBRARY_PATH='$(LIBRARY_PATH):$(brew --prefix)/lib' || echo"
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get update                    || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install autoconf          || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install bison             || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install build-essential   || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install cargo             || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install clang             || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install cmake-curses-gui  || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install cmake             || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install expat             || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install gettext           || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install golang-go         || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install libcurl4-openssl-dev || echo"
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install libssl-dev        || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install libtool           || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install mercurial         || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install npm               || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install pandoc            || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install pkg-config        || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install python3           || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install python3-pip       || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install python-is-python3 || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install util-linux        || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install virtualenv        || echo   "
	bash -c "[ '$(shell uname -s)' == 'Linux' ] && sudo apt-get install zlib              || echo   "

##	install gvm sequence
	@rm -rf $(HOME)/.gvm || echo "not removing ~/.gvm"
	@bash -c "bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer) || echo 'not installing gvm...'"
	bash -c "[ '$(shell uname -m)' == 'x86_64' ] && echo 'is x86_64' || echo 'not x86_64';"
	bash -c "[ '$(shell uname -m)' == 'arm64' ] && [ '$(shell uname -s)' == 'Darwin' ] && type -P brew && brew install pandoc || echo 'not arm64 AND Darwin';"
	bash -c "[ '$(shell uname -m)' == 'i386' ] && echo 'is i386' || echo 'not i386';"

##	install rustup sequence
	$(shell echo which rustup) || curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y --no-modify-path --default-toolchain stable --profile default & . "$(HOME)/.cargo/env"

##	install nvm sequence
	@bash -c "curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash && export NVM_DIR='$(HOME)/.nvm'; [ -s '$(NVM_DIR)/nvm.sh' ] && \. '$(NVM_DIR)/nvm.sh'; [ -s '$(NVM_DIR)/bash_completion' ] && \. '$(NVM_DIR)/bash_completion' &"

	bash -c "which autoconf                   || echo "
	bash -c "which automake                   || echo "
	bash -c "which brew                       || echo "
	bash -c "which cargo                      || echo "
	bash -c "which cmake                      || echo "
	bash -c "which go                         || echo "
	bash -c "which node                       || echo "
	bash -c "which rustup                     || echo "


