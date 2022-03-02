## [🐝](https://keyserver.ubuntu.com/pks/lookup?search=randy.lee.mcmillan%40gmail.com&fingerprint=on&op=vindex) [Github ](http://github.com/randymcmillan) [Twitter](https://twitter.com/RandyMcMillan) [Keybase](https://randymcmillan.keybase.pub)
 	make   command		description
 	
 	       init
 	       help
 	       report		environment args
 	       whatami		report system info
 	       adduser-git	add a user nameed git
 	       bootstrap	run bootstrap.sh - dotfile installer
 	       executable	make shell scripts executable
 	       template		base script for creating installer scripts
 	       checkbrew	source and run checkbrew command
 	       cirrus		source and run install-cirrus command
 	       config-dock	source and run config-dock-prefs
 	       all	        execute installer scripts
 	       alpine-shell	run install-shell.sh alpine user=root
 	       debian-shell	run install-shell.sh debian user=root
 	       vim		install vim and macvim on macos
 	       qt5		install qt@5
 	       gnupg		install gnupg and accessories
 	       bitcoin-libs	install bitcoin-libs

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