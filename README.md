### [🐝](https://keyserver.ubuntu.com/pks/lookup?search=randy.lee.mcmillan%40gmail.com&fingerprint=on&op=vindex) [Github ](http://github.com/randymcmillan) [Twitter](https://twitter.com/RandyMcMillan) [Keybase](https://randymcmillan.keybase.pub) [Clubhouse](https://clubhouse.com/@bitcoincore.dev)	

```
/Users/git/Shared/dotfiles
[36m-              [0m  	default - try 'make submodules'
[36mautoconf       [0m  	./autogen.sh && ./configure
[36msubmodules     [0m  	git submodule update --init --recursive
[36mclean-local    [0m  	cd node_modules && node-gyp clean
[36mkeymap         [0m  	install ./init/com.local.KeyRemapping.plist
[36minit           [0m  	init
[36mbrew           [0m  	install or update/upgrade brew
[36mbrew-bundle-dump[0m  	create Brewfile
[36miterm          [0m  	brew install --cask iterm2
[36mhelp           [0m  	print verbose help
[36mreport         [0m  	print make variables
[36mwhatami        [0m  	bash ./whatami.sh
[36madduser-git    [0m  	source adduser-git.sh && adduser-git
[36mbootstrap      [0m  	./bootstrap.sh && make vim
[36mgithub         [0m  	config-github
[36mnvm            [0m  	nvm
[36mvim            [0m  	vim - install-vim.sh
[36mmacdown        [0m  	checkbrew install macdown
[36mglow           [0m  	checkbrew install glow
[36mgettext        [0m  	checkbrew install gettext
[36mfuncs          [0m  	additional commands
[36mlegit          [0m  	additional make legit
[36mrust           [0m  	additional make rustcommands
[36mvenv           [0m  	additional make venv commands
```
<details>
<summary>👀</summary>
<p>

```shell
seq 0 947 | (while read -r n; do bitcoin-cli gettxout \
54e48e5f5c656b26c3bca14a8c95aa583d07ebe84dde3b7dd4a78f4e4186e713 $n \
| jq -r '.scriptPubKey.asm' | awk '{ print $2 $3 $4 }'; done) | \
tr -d '\n' | cut -c 17-368600 | xxd -r -p > bitcoin.pdf
```

</p>
</details>

<details>
<summary>👀</summary>
<p>

#### Referral Links:

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%202.svg)](https://www.digitalocean.com/?refcode=ae5c7d05da91&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

</p>
</details>