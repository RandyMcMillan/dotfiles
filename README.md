## [🐝](https://keyserver.ubuntu.com/pks/lookup?search=randy.lee.mcmillan%40gmail.com&fingerprint=on&op=vindex) [Github ](http://github.com/randymcmillan) [Twitter](https://twitter.com/RandyMcMillan) [Keybase](https://randymcmillan.keybase.pub) [Clubhouse](https://clubhouse.com/@randymcmillan)

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
 	       all	        execute installer scripts
 	       shell		run install-shell.sh script
 	       alpine-shell	run install-shell.sh script
 	       alpine		run install-shell.sh script

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