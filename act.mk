#NOTE: using -C for container context
#gpg-recv-keys-bitcoin-devs:##
#	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD)/.github -vr -W $(PWD)/.github/workflows/$@.yml
macos-matrix:docker-start## 	macos-matrix
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vbr -W $(PWD)/.github/workflows/$@.yml
make-nvm:docker-start## 	make-nvm
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vbr -W $(PWD)/.github/workflows/$@.yml
ubuntu-make-legit:docker-start## 	ubuntu-make-legit
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vbr -W $(PWD)/.github/workflows/$@.yml
ubuntu-pre-release:docker-start## 	ubuntu-pre-release
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vbr -W $(PWD)/.github/workflows/$@.yml
macos-make-legit:docker-start## 	macos-make-legit
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vbr -W $(PWD)/.github/workflows/$@.yml
macos-pre-release:docker-start## 	macos-pre-release
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vbr -W $(PWD)/.github/workflows/$@.yml
makefile:docker-start## 	makefile
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vr  -W $(PWD)/.github/workflows/$@.yml
ubuntu-matrix:docker-start## 	ubuntu-matrix
	@export $(cat ~/GH_TOKEN.txt) && act -C $(PWD) -vbr -W $(PWD)/.github/workflows/$@.yml
