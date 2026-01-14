# Bootstrap Script

An improved dotfiles management script with better error handling, modular design, and enhanced user experience.

## Features

- **Safe Operations**: Backup creation, dry-run mode, confirmation prompts
- **Modular Design**: Separated sync, install, and configuration logic
- **Maintainable**: External exclusion file and configuration options
- **Error Handling**: Proper logging, disk space checks, prerequisite validation
- **User Experience**: Colored output, progress indicators, help system

## Usage

```bash
# Interactive sync with backup (default)
./bootstrap.sh

# Force sync without confirmation
./bootstrap.sh --force sync

# Preview what would be synced
./bootstrap.sh --dry-run sync

# List available dotfiles
./bootstrap.sh link

# Pull changes from home directory
./bootstrap.sh pull

# Install development tools only
./bootstrap.sh install

# Show help
./bootstrap.sh help
./bootstrap.sh --help
```

## Configuration

### `.bootstrapignore`
Contains rsync exclusion patterns. Edit this file to control which files are excluded from sync operations.

### `.bootstrapconfig`
Contains script configuration options. Copy this file and modify values to override defaults.

## Commands

- `sync`: Sync dotfiles to home directory (default)
- `link`: List all available dotfiles
- `pull`: Pull changes from home to dotfiles repo
- `install`: Install development tools (sccache, rust, etc.)
- `help`: Show usage information

## Options

- `-f, --force`: Skip confirmation prompts
- `-n, --dry-run`: Show what would be done without executing
- `-v, --verbose`: Enable verbose output
- `-b, --backup`: Create backup before overwriting (default)
- `--no-backup`: Skip creating backups
- `-c, --config FILE`: Use custom config file

## Safety Features

- Creates automatic backups before overwriting
- Validates disk space before operations
- Checks for required tools (rsync)
- Color-coded logging with timestamps
- Runs error handling with `set -euo pipefail`

## Development Tools

The script automatically installs and configures:
- **sccache**: Rust compilation caching
- **Rust**: Via rustup if not already installed
- **Developer mode**: macOS developer tools access

## Migration from Original Script

This improved version maintains compatibility with the original script's functionality while adding:

1. **Better argument handling** - No more duplicated $1/$2 logic
2. **External exclusions** - Edit `.bootstrapignore` instead of inline patterns
3. **Modular functions** - Separate sync, install, and utility functions
4. **Enhanced safety** - Backups, dry-run mode, error handling
5. **Better UX** - Colored output, help system, progress feedback