
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
	

 make	  	command			description
 	
 	      	init
 	      	help
 	      	report			environment args
 	      	whatami			report system info
 	      	adduser-git		add a user named git
 	      	bootstrap		run bootstrap.sh - dotfile installer
 	      	executable		make shell scripts executable
 	      	checkbrew		source and run checkbrew command
 	      	checkbrew-install	install template.sh
 	      	cirrus			source and run install-cirrus command
 	      	config-dock		source and run config-dock-prefs
 	      	all			execute installer scripts
 	      	alpine-shell		run install-shell.sh alpine user=root
 	      	debian-shell		run install-shell.sh debian user=root
 	      	vim			install vim and macvim on macos
 	      	qt5			install qt@5
 	      	gnupg			install gnupg and accessories
 	      	bitcoin-libs		install bitcoin-libs
