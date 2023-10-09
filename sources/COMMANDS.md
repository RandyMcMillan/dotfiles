 /bin/sh ./config.status
config.status: executing depfiles commands
make [COMMAND] [EXTRA_ARGUMENTS]	

 make	                                                                                        	command			description
 	
 	                                                                                            	-
 	                                                                                            	help
 	                                                                                            	report			environment args
 	
 	                                                                                            	all			execute installer scripts
 	                                                                                            	init
 	                                                                                            	brew
 	                                                                                            	keymap
 	
 	                                                                                            	whatami			report system info
 	
 	                                                                                            	adduser-git		add a user named git
 	                                                                                            	adduser-git		add a user named git
 	                                                                                            	bootstrap		source bootstrap.sh
 	                                                                                            	install		 	install sequence
 	                                                                                            	github		 	config-github
 	                                                                                            	executable		make shell scripts executable
 	                                                                                            	template		install checkbrew command
 	                                                                                            	cirrus			source and run install-cirrus command
 	                                                                                            	config-dock		source and run config-dock-prefs
 #####################
 	                                                                                            	alpine-shell		run install-shell.sh alpine user=root
 	                                                                                            	alpine-build		run install-shell.sh alpine-build user=root
 	                                                                                            	debian-shell		run install-shell.sh debian user=root
 	                                                                                            	porter
 	                                                                                            	install-vim			install vim and macvim on macos
 	                                                                                            	qt5			install qt@5
 	
 	                                                                                            	bitcoin-libs		install bitcoin-libs
 	                                                                                            	bitcoin-depends		make depends from bitcoin repo
 	
 	                                                                                            	funcs			additional make functions
 detect
 	detect uname -s uname -m uname -p and install sequence
  	Darwin
 	bash -c "[ '$(shell uname -s)' == 'Darwin' ] && brew install boost               || echo "
  	Linux
 	install gvm sequence
 	install rustup sequence
 	install nvm sequence
 	
 	                                                                                            		funcs-1		additional function 1
 	                                                                                            	submodules		git submodule --init --recursive
 	                                                                                            	submodules-deinit	git submodule deinit --all -f

Useful Commands:

git-\<TAB>
gpg-\<TAB>
bitcoin-\<TAB>

