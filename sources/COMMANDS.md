
	make                        
	make                        -
	make                        init
	make                        help
	make                        report
	make                        all
	make                        all force=true
	make                        bootstrap
	make                        executable
	make                        shell #alpine-shell
	make                        alpine-shell
	make                        d-shell #debian-shell
	make                        debian-shell
	make                        vim
	make                        config-git
	make                        config-github
	make                        adduser-git
	make                        install-dotfiles-on-remote
	remote_user=<user> remote_server=<domain/ip> make install-dotfiles-on-remote
	---
	
	make                        docs
	make                        push
	
	---
	
 	make   command		description
 	       -		default
 	       init
 	       help
 	       report		environment args
 	       whatami		report system info
 	       adduser-git	add a user nameed git
 	       bootstrap	run bootstrap.sh - dotfile installer
 	       executable	make shell scripts executable
 	       template		base script for creating installer scripts
 	       checkbrew	source and run checkbrew command
 	       config-dock	source and run config-dock-prefs
 	       all	        execute installer scripts
 	       shell		run install-shell.sh script
 	       alpine-shell	run install-shell.sh script
 	       alpine		run install-shell.sh script
 	       bitcoin-libs	install bitcoin-libs
