
	[ARGUMENTS]	
      args:	
        - TIME=1633380935	
        - PROJECT_NAME=dotfiles	
        - GIT_USER_NAME=randymcmillan	
        - GIT_USER_EMAIL=randy.lee.mcmillan@gmail.com	
        - GIT_SERVER=https://github.com	
        - GIT_PROFILE=randymcmillan	
        - GIT_BRANCH=master	
        - GIT_HASH=dfaa71a	
        - GIT_PREVIOUS_HASH=8129ce3	
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
	make readme	
	
	make all force=true	

