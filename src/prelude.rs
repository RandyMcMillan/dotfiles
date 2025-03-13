//! Prelude for climake to allow easy importing of data structures
//!
//! # Contents
//!
//! This prelude is small as climake itself isn't a woefully complex library,
//! here's what this prelude includes:
//!
//! - Base-level
//!   - [climake::Argument](Argument)
//!   - [climake::CliMake](CliMake)
//!   - [climake::Subcommand](Subcommand)
//! - IO structures
//!   - [climake::io::Data](Data)
//!   - [climake::io::Input](Input)
//! - Parsed structures
//!   - [climake::parsed::ParsedArgument](ParsedArgument)
//!   - [climake::parsed::ParsedCli](ParsedCli)
//!   - [climake::parsed::ParsedSubcommand](ParsedSubcommand)

pub use crate::io::{Data, Input};
pub use crate::parsed::{ParsedArgument, ParsedCli, ParsedSubcommand};
pub use crate::{Argument, CliMake, Subcommand};
