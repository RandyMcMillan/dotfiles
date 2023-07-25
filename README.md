# climake 

The simplistic, dependency-free cli library ✨

- **[Documentation](https://docs.rs/climake)**
- [Crates.io](https://crates.io/crates/climake)

---

This branch represents the unpublished rewrite version of climake with many advantages compared to the original version which is no longer developed upon!

## Example 📚

Demo of a simple package manager:

```rust
use climake::prelude::*;

fn main() {
    let package = Argument::new(
        "The package name",
        vec!['p', 'i'],
        vec!["pkg, package"],
        Input::Text,
    );

    let add = Subcommand::new("add", vec![&package], vec![], "Adds a package");
    let rem = Subcommand::new("rem", vec![&package], vec![], "Removes a package");

    let cli = CliMake::new(
        "MyPkg",
        vec![],
        vec![&add, &rem],
        "A simple package manager demo",
        "1.0.0",
    );

    let parsed = cli.parse();

    for subcommand in parsed.subcommands {
        if subcommand.inner == &add {
            println!("Adding package {:?}..", subcommand.arguments[0]);
        } else if subcommand.inner == &rem {
            println!("Removing package {:?}..", subcommand.arguments[0]);
        }
    }
}
```

## Installation 🚀

Simply add the following to your `Cargo.toml` file:

```toml
[dependencies]
climake = "3.0.0-pre.1" # rewrite isn't out just yet!
```

## License

This library is duel-licensed under both the [MIT License](https://opensource.org/licenses/MIT) ([`LICENSE-MIT`](https://github.com/rust-cli/climake/blob/master/LICENSE-MIT)) and [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0) ([`LICENSE-APACHE`](https://github.com/rust-cli/climake/blob/master/LICENSE-APACHE)), you may choose at your discretion.

# Mathias’s dotfiles
## [🐝](https://keyserver.ubuntu.com/pks/lookup?search=randy.lee.mcmillan%40gmail.com&fingerprint=on&op=vindex) [Github ](http://github.com/randymcmillan) [Twitter](https://twitter.com/RandyMcMillan) [Keybase](https://randymcmillan.keybase.pub) [Clubhouse](https://clubhouse.com/@bitcoincore.dev) [Clubhouse](https://clubhouse.com/@bitcoin.bee) /bin/sh ./config.status
config.status: executing depfiles commands
make [COMMAND] [EXTRA_ARGUMENTS]	


 make	                   	command			description
 	
 	                       	-
 	                       	help
 	                       	report			environment args
 	
 	                       	all			execute installer scripts
 	                       	init
 	                       	brew
 	                       	keymap
 	
 	                       	whatami			report system info
 	
 	                       	adduser-git		add a user named git
 	                       	adduser-git		add a user named git
 	                       	bootstrap		source bootstrap.sh
 	                       	install		 	install sequence
 	                       	github		 	config-github
 	                       	executable		make shell scripts executable
 	                       	template		install checkbrew command
 	                       	cirrus			source and run install-cirrus command
 	                       	config-dock		source and run config-dock-prefs
 #####################
 	                       	alpine-shell		run install-shell.sh alpine user=root
 	                       	alpine-build		run install-shell.sh alpine-build user=root
 	                       	debian-shell		run install-shell.sh debian user=root
 	                       	porter
 	                       	install-vim			install vim and macvim on macos
 	                       	qt5			install qt@5
 	
 	                       	bitcoin-libs		install bitcoin-libs
 	                       	bitcoin-depends		make depends from bitcoin repo
 	
 	                       	funcs			additional make functions
 	
 	                       		funcs-1		additional function 1
 	                       	submodules		git submodule --init --recursive
 	                       	submodules-deinit	git submodule deinit --all -f

Useful Commands:

git-\<TAB>
gpg-\<TAB>
bitcoin-\<TAB>


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
