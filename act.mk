#NOTE: using -C for container context
#gpg-recv-keys-bitcoin-devs:## 	
#	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD)/.github -vr -W $(PWD)/.github/workflows/$@.yml
macos-matrix:## 	
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr -W $(PWD)/.github/workflows/$@.yml
make-nvm:## 	
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr -W $(PWD)/.github/workflows/$@.yml
ubuntu-make-legit:## 	
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr -W $(PWD)/.github/workflows/$@.yml
ubuntu-pre-release:## 	
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr -W $(PWD)/.github/workflows/$@.yml
macos-make-legit:##	
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr -W $(PWD)/.github/workflows/$@.yml
macos-pre-release:## 	
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr -W $(PWD)/.github/workflows/$@.yml
makefile:## 	
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr -W $(PWD)/.github/workflows/$@.yml
ubuntu-matrix:## 	
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr -W $(PWD)/.github/workflows/$@.yml
