
	[ARGUMENTS]	
      args:	
        - TIME=1632459334	
        - PROJECT_NAME=dotfiles	
        - GIT_USER_NAME=randymcmillan	
        - GIT_USER_EMAIL=randy.lee.mcmillan@gmail.com	
        - GIT_SERVER=https://github.com	
        - GIT_PROFILE=randymcmillan	
        - GIT_BRANCH=master	
        - GIT_HASH=2b2ea40	
        - GIT_PREVIOUS_HASH=c5294d9	
        - GIT_REPO_ORIGIN=git@github.com:RandyMcMillan/dotfiles.git	
        - GIT_REPO_NAME=dotfiles	
        - GIT_REPO_PATH=/Users/git/dotfiles	

	make all	
	make bootstrap	
	make executable	
	make alpine-shell	
	make shell	
	make vim	
	make config-git	
	make config-github	
	make push	
	
	make all force=true	
