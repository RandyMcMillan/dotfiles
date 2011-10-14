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

## Installation

```bash
git clone https://github.com/mathiasbynens/dotfiles.git && cd dotfiles && ./bootstrap.sh
```

When setting up a new Mac, you may want to set some sensible OS X defaults:

```bash
./.osx
```

To update, `cd` into your local `dotfiles` repository and then:

```bash
./bootstrap.sh
```

Suggestions/improvements
[welcome](https://github.com/mathiasbynens/dotfiles/issues)!

## Thanks to…
* [Gianni Chiappetta](http://gf3.ca/) for sharing his [amazing collection of dotfiles](https://github.com/gf3/dotfiles)
* [Matijs Brinkhuis](http://hotfusion.nl/) and his [homedir repository](https://github.com/matijs/homedir)
* [Jan Moesen](http://jan.moesen.nu/) and his [ancient `.bash_profile`](https://gist.github.com/1156154) + [shiny tilde repository](https://github.com/janmoesen/tilde)
* [Tim Esselens](http://devel.datif.be/)
* anyone who [contributed a patch](https://github.com/mathiasbynens/dotfiles/contributors) or made a helpful suggestion