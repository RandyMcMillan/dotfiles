//! Demo of a simple package manager
use randymcmillan_dotfiles::prelude::Input;
use randymcmillan_dotfiles::prelude::*;
use randymcmillan_dotfiles::Argument;
use randymcmillan_dotfiles::CliMake;
use randymcmillan_dotfiles::Subcommand;



    /// Checks that the [CliMake::add_arg] method works correctly
    #[test]
    fn cli_add_arg() {
        let mut cli = CliMake::new("example", vec![], vec![], "Add arg check", None);
        let arg = Argument::new("arg help", vec![], vec![], Input::None);

        cli.add_arg(&arg).add_arg(&arg);

        assert_eq!(cli.arguments, vec![&arg, &arg])
    }

    /// Checks that the [CliMake::add_args] method works correctly
    #[test]
    fn cli_add_args() {
        let mut cli = CliMake::new("example", vec![], vec![], "Add arg check", None);
        let arg = Argument::new("arg help", vec![], vec![], Input::None);

        cli.add_args(vec![&arg, &arg]).add_args(vec![&arg, &arg]);

        assert_eq!(cli.arguments, vec![&arg, &arg, &arg, &arg])
    }

    /// Checks that the [CliMake::add_subcmds] method works correctly
    #[test]
    fn cli_add_subcmds() {
        let mut cli = CliMake::new("example", vec![], vec![], "Add arg check", None);
        let subcmd = Subcommand::new("example", vec![], vec![], None);

        cli.add_subcmds(vec![&subcmd, &subcmd])
            .add_subcmds(vec![&subcmd, &subcmd]);

        assert_eq!(cli.subcommands, vec![&subcmd, &subcmd, &subcmd, &subcmd])
    }

    /// Checks that the [CliMake::add_subcmd] method works correctly
    #[test]
    fn cli_add_subcmd() {
        let mut cli = CliMake::new("example", vec![], vec![], "Add arg check", None);
        let subcmd = Subcommand::new("example", vec![], vec![], None);

        cli.add_subcmd(&subcmd).add_subcmd(&subcmd);

        assert_eq!(cli.subcommands, vec![&subcmd, &subcmd])
    }

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

    let mut parsed = cli.parse();

    //for subcommand in parsed.subcommands {
    ////println!("{:?}", subcommand);
    ////    //if subcommand.inner == &add {
    ////    //    println!("Adding package {:?}..", subcommand.arguments[0]);
    ////    //} else if subcommand.inner == &rem {
    ////    //    println!("Removing package {:?}..", subcommand.arguments[0]);
    ////    //}
    //}
}
