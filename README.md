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

### Using Git and the bootstrap script

You can clone the repository wherever you want. (I like to keep it in `~/Projects/dotfiles`, with `~/dotfiles` as a symlink.) The bootstrapper script will pull in the latest version and copy the files to your home folder.

```bash
git clone https://github.com/mathiasbynens/dotfiles.git && cd dotfiles && ./bootstrap.sh
```

To update, `cd` into your local `dotfiles` repository and then:

```bash
./bootstrap.sh
```

Alternatively, to update while avoiding the confirmation prompt:

```bash
./bootstrap.sh -f
```

### Git-free install

To install these dotfiles without Git:

```bash
cd; curl -#L https://github.com/mathiasbynens/dotfiles/tarball/master | tar -xzv --strip-components 1 --exclude={README.md,bootstrap.sh}
```

To update later on, just run that command again.

### Add custom commands without creating a new fork

If `~/.extra` exists, it will be sourced along with the other files. You can use this to add a few custom commands without the need to fork this entire repository, or to add commands you don’t want to commit to a public repository.

My `~/.extra` looks something like this:

```bash
GIT_AUTHOR_NAME="Mathias Bynens"
GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
GIT_AUTHOR_EMAIL="mathias@mailinator.com"
GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
```

### Sensible OS X defaults

When setting up a new Mac, you may want to set some sensible OS X defaults:

```bash
./.osx
```

## Feedback

Suggestions/improvements
[welcome](https://github.com/mathiasbynens/dotfiles/issues)!

## Thanks to…

* [Gianni Chiappetta](http://gf3.ca/) for sharing his [amazing collection of dotfiles](https://github.com/gf3/dotfiles)
* [Matijs Brinkhuis](http://hotfusion.nl/) and his [homedir repository](https://github.com/matijs/homedir)
* [Jan Moesen](http://jan.moesen.nu/) and his [ancient `.bash_profile`](https://gist.github.com/1156154) + [shiny tilde repository](https://github.com/janmoesen/tilde)
* [Ben Alman](http://benalman.com/) and his [dotfiles repository](https://github.com/cowboy/dotfiles)
* [Tim Esselens](http://devel.datif.be/)
* anyone who [contributed a patch](https://github.com/mathiasbynens/dotfiles/contributors) or [made a helpful suggestion](https://github.com/mathiasbynens/dotfiles/issues)