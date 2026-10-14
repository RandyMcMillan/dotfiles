use clap::{CommandFactory, Parser, Subcommand};
use std::env;
use std::fs::OpenOptions;
use std::io::Write;
use std::process::{Command, ExitStatus};
use std::sync::atomic::{AtomicBool, Ordering};

static DRY_RUN: AtomicBool = AtomicBool::new(false);

#[derive(Parser, Debug)]
#[command(name = "checkbrew", about = "Homebrew helper (Rust implementation)")]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,

    // Legacy flags for compatibility with the original shell implementation.
    #[arg(short = 'i', long = "install")]
    install: Option<String>,

    #[arg(long = "cask")]
    cask: bool,

    #[arg(short = 'f', long = "force")]
    force: bool,

    #[arg(short = 's', long = "sudo")]
    sudo: bool,

    #[arg(short = 'v', long = "verbose")]
    verbose: bool,

    #[arg(long = "dry-run")]
    dry_run: bool,

    #[arg(short = 'V', long = "version")]
    version: bool,

    #[arg(long = "ud")]
    ud: bool,

    #[arg(long = "ug")]
    ug: bool,

    #[arg(long = "uu")]
    uu: bool,

    #[arg(long = "info", value_name = "ITEM")]
    info: Vec<String>,
}

#[derive(Subcommand, Debug)]
enum BundleCommands {
    #[command(about = "Install from Brewfile")]
    Install {
        #[arg(short = 'f', long = "force")]
        force: bool,

        #[arg(long = "file", value_name = "PATH", default_value = "Brewfile")]
        file: String,
    },

    #[command(about = "Dump a Brewfile")]
    Dump {
        #[arg(short = 'f', long = "force")]
        force: bool,

        #[arg(long = "file", value_name = "PATH", default_value = "Brewfile")]
        file: String,
    },

    #[command(about = "Remove unbundled packages")]
    Cleanup {
        #[arg(short = 'f', long = "force")]
        force: bool,
    },
}

#[derive(Subcommand, Debug)]
enum Commands {
    #[command(alias = "checkbrew-bundle", about = "bundle install/dump/cleanup")]
    Bundle {
        #[command(subcommand)]
        command: Option<BundleCommands>,
    },

    #[command(alias = "checkbrew-cleanup", about = "Run brew bundle cleanup")]
    Cleanup,

    #[command(alias = "checkbrew-help", about = "Show checkbrew help")]
    Usage,

    #[command(
        alias = "checkbrew-sudoless",
        about = "Take ownership of Homebrew prefix"
    )]
    Sudoless,

    #[command(
        alias = "checkbrew-uninstall",
        about = "Uninstall all Homebrew formulae and casks"
    )]
    Uninstall,

    #[command(alias = "checkbrew-upgrade", about = "Upgrade Homebrew packages")]
    Upgrade {
        #[arg(short = 'f', long = "force")]
        force: bool,

        #[arg(value_name = "FORMULA")]
        items: Vec<String>,
    },

    #[command(about = "Install a Homebrew formula or cask")]
    Install {
        #[arg(short = 'f', long = "force")]
        force: bool,

        #[arg(long = "cask")]
        cask: bool,

        #[arg(value_name = "FORMULA")]
        package: String,
    },

    #[command(about = "Run brew update")]
    Update,

    #[command(about = "Run brew update (-ud)")]
    Ud,

    #[command(about = "Run brew upgrade (-ug)")]
    Ug,

    #[command(about = "Update and upgrade (-uu)")]
    Uu,

    #[command(about = "Show brew info for packages")]
    Info {
        #[arg(value_name = "FORMULA")]
        items: Vec<String>,
    },

    #[command(about = "Show Homebrew version")]
    Version,

    #[command(about = "Run brew doctor")]
    Doctor,

    #[command(about = "List outdated packages")]
    Outdated {
        #[arg(long = "greedy")]
        greedy: bool,

        #[arg(long = "cask")]
        cask: bool,
    },

    #[command(about = "Reinstall formula(e)/cask(s)")]
    Reinstall {
        #[arg(short = 'f', long = "force")]
        force: bool,

        #[arg(long = "cask")]
        cask: bool,

        #[arg(value_name = "FORMULA")]
        items: Vec<String>,
    },

    #[command(about = "Search Homebrew")]
    Search {
        #[arg(long = "cask")]
        cask: bool,

        #[arg(long = "installed")]
        installed: bool,

        #[arg(value_name = "QUERY")]
        query: Option<String>,
    },

    #[command(about = "Remove unused dependencies")]
    Autoremove,

    #[command(about = "Show leaves (manually installed)")]
    Leaves,

    #[command(about = "Clean up old downloads and caches")]
    CleanupAll {
        #[arg(long = "prune", value_name = "DAYS")]
        prune: Option<u32>,

        #[arg(long = "scrub")]
        scrub: bool,
    },
}

fn is_root() -> bool {
    Command::new("id")
        .arg("-u")
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| s.trim() == "0")
        .unwrap_or(false)
}

fn has(program: &str) -> bool {
    Command::new("sh")
        .args(["-c", &format!("command -v {} >/dev/null 2>&1", program)])
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

fn run(cmd: &str, args: &[&str]) -> ExitStatus {
    if DRY_RUN.load(Ordering::Relaxed) {
        print!("dry-run: {} ", cmd);
        for a in args {
            print!("{} ", a);
        }
        println!();
        return Command::new("true")
            .status()
            .unwrap_or_else(|_| std::process::exit(0));
    }
    match Command::new(cmd).args(args).status() {
        Ok(status) => status,
        Err(e) => {
            eprintln!("{}: {}", cmd, e);
            std::process::exit(1)
        }
    }
}

fn run_output(cmd: &str, args: &[&str]) -> String {
    Command::new(cmd)
        .args(args)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default()
}

fn print_help() {
    let mut cmd = Cli::command();
    let _ = cmd.print_help();
    println!();
}

fn sudoless() {
    if !has("brew") {
        return;
    }
    let prefix = run_output("brew", &["--prefix"]);
    let prefix = prefix.trim();
    let user = env::var("USER").unwrap_or_else(|_| "root".to_string());
    let dirs = ["share/man", "bin", "lib/node", "include/node", "sbin"];
    for d in &dirs {
        let path = format!("{}/{}", prefix, d);
        let _ = run("sudo", &["mkdir", "-p", &path]);
        let _ = run("sudo", &["chown", "-R", &user, &path]);
    }
}

fn upgrade(force: bool, items: &[String]) {
    if !is_root() && has("brew") {
        if items.is_empty() {
            let mut args = vec!["upgrade"];
            if force {
                args.insert(0, "--force");
            }
            let refs: Vec<&str> = args.iter().copied().collect();
            let _ = run("brew", &refs);
        } else {
            for item in items {
                println!("{}", item);
                let mut args = vec!["upgrade"];
                if force {
                    args.insert(1, "--force");
                }
                args.push(item);
                let refs: Vec<&str> = args.iter().copied().collect();
                let _ = run("brew", &refs);
            }
        }
    }
}

fn uninstall() {
    let formulae = run_output("brew", &["list", "--formula"]);
    let formulae: Vec<&str> = formulae.split_whitespace().collect();
    if !formulae.is_empty() {
        let mut args = vec!["remove", "--force"];
        args.extend(formulae);
        let refs: Vec<&str> = args.iter().copied().collect();
        let _ = run("brew", &refs);
    }
    let casks = run_output("brew", &["list"]);
    let casks: Vec<&str> = casks.split_whitespace().collect();
    if !casks.is_empty() {
        let mut args = vec!["remove", "--cask", "--force"];
        args.extend(casks);
        let refs: Vec<&str> = args.iter().copied().collect();
        let _ = run("brew", &refs);
    }
}


fn bundle_install(force: bool, file: &str) {
    let mut args = vec!["bundle", "install"];
    if force {
        args.push("--force");
    }
    args.push("--file");
    args.push(file);
    let refs: Vec<&str> = args.iter().copied().collect();
    let _ = run("brew", &refs);
}

fn bundle(force: bool, file: &str) {
    if !is_root() && has("brew") {
        let path = std::path::Path::new(file);
        if !force && path.exists() {
            eprintln!("{} already exists. Use --force to overwrite.", file);
            print_help();
            return;
        }
        if force {
            let mut args = vec!["bundle", "--force", "dump", "--file", file];
            let refs: Vec<&str> = args.iter().copied().collect();
            let _ = run("brew", &refs);
        } else {
            let mut args = vec!["bundle", "dump", "--file", file];
            let refs: Vec<&str> = args.iter().copied().collect();
            let _ = run("brew", &refs);
        }
    }
}

fn cleanup(force: bool) {
    if !is_root() && has("brew") {
        if force {
            let _ = run("brew", &["bundle", "--force", "cleanup"]);
        } else {
            let _ = run("brew", &["bundle", "cleanup"]);
        }
    }
}

fn install_reinstall(items: &[String], cask: bool, force: bool) {
    if items.is_empty() {
        return;
    }
    let mut args = vec!["reinstall"];
    if force {
        args.push("--force");
    }
    if cask {
        // reinstall casks still uses formula name
    }
    let mut owned: Vec<String> = args.iter().map(|s| s.to_string()).collect();
    for item in items {
        owned.push(item.clone());
    }
    let refs: Vec<&str> = owned.iter().map(String::as_str).collect();
    let _ = run("brew", &refs);
    let _ = cask;
}

fn install_package(package: &str, cask: bool, force: bool) {
    if cask {
        let _ = run("brew", &["info", "--cask", package]);
        let mut owned = vec!["install".to_string()];
        if force {
            owned.push("--force".to_string());
        }
        owned.push(format!("homebrew/cask/{}", package));
        let refs: Vec<&str> = owned.iter().map(String::as_str).collect();
        let _ = run("brew", &refs);
    } else {
        let _ = run("brew", &["info", package]);
        let mut args = vec!["install"];
        if force {
            args.push("--force");
        }
        let mut refs: Vec<&str> = args.to_vec();
        refs.push(package);
        let _ = run("brew", &refs);
    }
}

fn setup() {
    if DRY_RUN.load(Ordering::Relaxed) {
        return;
    }
    if is_root() {
        println!("home brew prevents being installed from root!!!\nTry\nmake adduser-git");
    }

    if !has("brew") {
        let _ = Command::new("/bin/bash")
            .args(["-c", "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"])
            .status();
    }

    if has("brew") {
        if !has("gawk") {
            if has("gawk") {
                let _ = run("brew", &["unlink", "gawk"]);
            }
            let _ = run("brew", &["install", "gawk"]);
            let _ = run("brew", &["link", "gawk"]);
        }
        if !has("git") {
            let _ = run("brew", &["install", "git"]);
        }
    }

    let os = std::env::consts::OS;
    if os == "linux" {
        if has("apt") {
            if is_root() {
                let _ = run("apt", &["install", "-y", "gawk", "clang-tools"]);
            } else {
                let _ = run("sudo", &["apt", "install", "-y", "gawk", "clang-tools"]);
            }
        }
        if let Ok(mut f) = OpenOptions::new()
            .append(true)
            .create(true)
            .open("/home/git/.bash_profile")
        {
            let _ = writeln!(
                f,
                "eval \"$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)\""
            );
        }
    } else {
        println!();
    }
}

fn main() {
    let cli = Cli::parse();
    DRY_RUN.store(cli.dry_run, Ordering::Relaxed);
    setup();

    if let Some(command) = cli.command {
        match command {
            Commands::Bundle { command } => {
                match command {
                    Some(BundleCommands::Install { force, file }) => {
                        bundle_install(force || cli.force, &file);
                    }
                    Some(BundleCommands::Dump { force, .. }) => {
                        bundle(force || cli.force, "Brewfile");
                    }
                    Some(BundleCommands::Cleanup { force }) => {
                        cleanup(force || cli.force);
                    }
                    None => {
                        bundle(cli.force, "Brewfile");
                    }
                }
            }
            Commands::Cleanup => cleanup(cli.force),
            Commands::Usage => print_help(),
            Commands::Sudoless => sudoless(),
            Commands::Uninstall => uninstall(),
            Commands::Upgrade { force, items } => upgrade(force || cli.force, &items),
            Commands::Install {
                force,
                cask,
                package,
            } => install_package(&package, cask || cli.cask, force || cli.force),
            Commands::Update => {
                let _ = run("brew", &["update"]);
            }
            Commands::Ud => {
                let _ = run("brew", &["update"]);
            }
            Commands::Ug => {
                upgrade(cli.force, &[]);
            }
            Commands::Uu => {
                let _ = run("brew", &["update"]);
                let _ = run("brew", &["upgrade"]);
            }
            Commands::Info { items } => {
                for item in &items {
                    println!("item = {}", item);
                    let _ = run("brew", &["info", item]);
                }
                if items.is_empty() && !cli.info.is_empty() {
                    for item in &cli.info {
                        println!("item = {}", item);
                        let _ = run("brew", &["info", item]);
                    }
                }
            }
            Commands::Version => {
                let _ = run("brew", &["--version"]);
            }
            Commands::Doctor => {
                let _ = run("brew", &["doctor"]);
            }
            Commands::Outdated { greedy, cask } => {
                let mut args = vec!["outdated"];
                if greedy {
                    args.push("--greedy");
                }
                if cask {
                    args.push("--cask");
                }
                let refs: Vec<&str> = args.iter().copied().collect();
                let _ = run("brew", &refs);
            }
            Commands::Reinstall { force, cask, items } => {
                install_reinstall(&items, cask, force);
            }
            Commands::Search {
                cask,
                installed,
                query,
            } => {
                let mut args = vec!["search".to_string()];
                if cask {
                    args.push("--cask".to_string());
                }
                if installed {
                    args.push("--installed".to_string());
                }
                if let Some(q) = query {
                    args.push(q.clone());
                }
                let refs: Vec<&str> = args.iter().map(String::as_str).collect();
                let _ = run("brew", &refs);
            }
            Commands::Autoremove => {
                let _ = run("brew", &["autoremove"]);
            }
            Commands::Leaves => {
                let _ = run("brew", &["leaves"]);
            }
            Commands::CleanupAll { prune, scrub } => {
                let mut owned = vec!["cleanup".to_string()];
                if let Some(days) = prune {
                    owned.push(format!("--prune={}", days));
                }
                if scrub {
                    owned.push("--scrub".to_string());
                }
                let refs: Vec<&str> = owned.iter().map(String::as_str).collect();
                let _ = run("brew", &refs);
            }
        }
        return;
    }

    // Legacy flag handling.
    if cli.install.is_some() {
        install_package(cli.install.as_deref().unwrap(), cli.cask, cli.force);
        return;
    }
    if cli.ud {
        let _ = run("brew", &["update"]);
        return;
    }
    if cli.uu {
        let _ = run("brew", &["update"]);
        let _ = run("brew", &["upgrade"]);
        return;
    }
    if cli.ug {
        upgrade(cli.force, &[]);
        return;
    }
    if !cli.info.is_empty() {
        for item in &cli.info {
            println!("item = {}", item);
            let _ = run("brew", &["info", item]);
        }
        return;
    }
    if cli.version {
        let _ = run("brew", &["--version"]);
        return;
    }
    if cli.verbose {
        // accepted
    }

    print_help();
}
