#!/usr/bin/env bash

function help () {
	
	echo "Example:"
	echo "./get-forks.sh NostrGit NostrGit" && exit

	}
function build_jq () {

	git clone https://github.com/stedolan/jq.git
	cd jq
	autoreconf -i
	./configure --disable-maintainer-mode
	make
	sudo make install

	}

if ! hash jq 2>/dev/null; then
if ! hash brew 2>/dev/null; then
	build_jq
else
	brew install jq
fi
if ! hash apt-get 2>/dev/null; then
	build_jq
else
	apt-get install jq
fi
fi

if [ -z $1 ]; then
	help
fi
if [ -z $2 ]; then
	help
fi

GH_TOKEN=$(cat ~/GH_TOKEN.txt)
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GH_TOKEN"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$1/$2/forks || help