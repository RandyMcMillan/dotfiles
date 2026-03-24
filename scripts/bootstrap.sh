#!/usr/bin/env bash

# --- Strict Mode ---
# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error when substituting.
# Exit if any part of a pipeline fails.
set -euo pipefail

# --- Environment Variables & Paths ---
# Determine the directory where this script is located
# This should resolve to the root of the dotfiles repository (one level up from 'scripts/').
# Get the absolute path of the directory containing this script.
SCRIPT_DIR_SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Go up one level from the script's directory to get the repository root.
readonly SCRIPT_DIR="$( cd "$SCRIPT_DIR_SELF"/.. && pwd )"
readonly HOME_DIR="$HOME"

# Configuration file name (relative to SCRIPT_DIR)
CONFIG_FILE_NAME=".bootstrapconfig"
# Log file name (relative to SCRIPT_DIR)
LOG_FILE_NAME="bootstrap.log"
# Exclusions file name (relative to SCRIPT_DIR)
EXCLUDE_FILE_NAME=".bootstrapignore"

# Full paths, now correctly based on the determined SCRIPT_DIR
CONFIG_FILE_PATH="$SCRIPT_DIR/$CONFIG_FILE_NAME"
LOG_FILE_PATH="$SCRIPT_DIR/$LOG_FILE_NAME"
EXCLUDE_FILE_PATH="$SCRIPT_DIR/$EXCLUDE_FILE_NAME"

# --- Script Metadata ---
# Name: bootstrap.sh
# Description: Automates dotfile synchronization and development environment setup.
# Version: 1.1.3

# --- Default Configuration Values ---
DRY_RUN=false
VERBOSE=false
FORCE=false
BACKUP=true
# Enable/disable specific tool installations
INSTALL_SCCACHE=true
INSTALL_RUSTUP=true # Only if sccache installation requires it
INSTALL_BASH_COMPLETION=true

# --- Colors for Output ---


# --- Logging Functions ---
# Logs a message with a timestamp and color. Outputs to both console and log file.
log() {
    echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "$LOG_FILE_PATH"
}

# Provides an alias for informational messages.
info() {
    log "$@" # Alias log function for informational messages
}

# Logs an error message. Outputs to both console (stderr) and log file.
error() {
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "$LOG_FILE_PATH" >&2
}

# Logs a success message. Outputs to both console and log file.
success() {
    echo "[SUCCESS] $(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "$LOG_FILE_PATH"
}

# Logs a warning message. Outputs to both console and log file.
warn() {
    echo "[WARN] $(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "$LOG_FILE_PATH"
}

# --- Helper Functions ---

# Checks if a command is available in the system's PATH.
# Usage: command_exists <command_name>
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Safely retrieves a Git global configuration value.
# Usage: git_config_get <config_key>
git_config_get() {
    git config --global "$1" 2>/dev/null
}

# Safely sets a Git global configuration value, only if it differs from the current value.
# Usage: git_config_set <config_key> <config_value>
git_config_set() {
    local key="$1"
    local value="$2"
    if [[ "$(git_config_get "$key")" != "$value" ]]; then
        log "Setting git config: '$key' = '$value'"
        # Use tee to capture output to log, but suppress direct output if not verbose
        if [[ "$VERBOSE" == "true" ]]; then
            git config --global "$key" "$value" | tee -a "$LOG_FILE_PATH"
        else
            git config --global "$key" "$value" >> "$LOG_FILE_PATH" 2>&1
        fi
    else
        log "Git config already set: '$key' = '$value'"
    fi
}

# Checks if 'spctl developer-mode' subcommand is supported.
# Returns 0 (true) if supported, 1 (false) otherwise.
_is_developer_mode_supported() {
    spctl --help 2>&1 | grep -q "Developer Mode Usage:"
}

# --- Configuration Loading ---
# Loads configuration settings from the specified config file, allowing overrides by command-line flags.
load_config() {
    if [[ -f "$CONFIG_FILE_PATH" ]]; then
        log "Loading configuration from $CONFIG_FILE_PATH"
        # Read config file line by line, respecting comments and empty lines
        while IFS='=' read -r key value || [[ -n "$key" ]]; do
            # Trim whitespace from key and value
            key=$(echo "$key" | xargs)
            value=$(echo "$value" | xargs)

            # Skip comments, empty lines, or lines without an '=' separator
            [[ "$key" =~ ^#.* ]] || [[ -z "$key" ]] || [[ -z "$value" ]] && continue

            # Assign values to script variables if they match expected options
            case "$key" in
                DRY_RUN) DRY_RUN="$value" ;;
                VERBOSE) VERBOSE="$value" ;;
                FORCE) FORCE="$value" ;;
                BACKUP) BACKUP="$value" ;;
                LOG_FILE_NAME) LOG_FILE_NAME="$value"; LOG_FILE_PATH="$SCRIPT_DIR/$LOG_FILE_NAME" ;; # Allow log file name override
                EXCLUDE_FILE_NAME) EXCLUDE_FILE_NAME="$value"; EXCLUDE_FILE_PATH="$SCRIPT_DIR/$EXCLUDE_FILE_NAME" ;; # Allow exclude file name override
                INSTALL_SCCACHE) INSTALL_SCCACHE="$value" ;;
                INSTALL_RUSTUP) INSTALL_RUSTUP="$value" ;;
                INSTALL_BASH_COMPLETION) INSTALL_BASH_COMPLETION="$value" ;;
                # Add other configuration options here if needed
            esac
        done < "$CONFIG_FILE_PATH"
    else
        log "Configuration file '$CONFIG_FILE_PATH' not found. Using default values."
    fi
}

# --- Command Line Argument Parsing ---
# Parses arguments, allowing them to override settings loaded from the config file.
parse_arguments() {
    local command="sync" # Default command

    # Process arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_usage
                exit 0
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -n|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -b|--backup)
                BACKUP=true
                shift
                ;;
            --no-backup)
                BACKUP=false
                shift
                ;;
            --config)
                if [[ -n "$2" && "$2" != -* ]]; then
                    CONFIG_FILE_NAME="$2"
                    CONFIG_FILE_PATH="$SCRIPT_DIR/$CONFIG_FILE_NAME"
                    load_config # Reload config if --config is specified
                    shift 2
                else
                    error "Option --config requires a file path."
                    show_usage
                    exit 1
                fi
                ;;
            sync|link|pull|install|install-vim)
                command="$1"
                shift
                ;;
            *)
                error "Unknown option or command: '$1'"
                show_usage
                exit 1
                ;;
        esac
    done

    # Set the command to be executed
    export BOOTSTRAP_COMMAND="$command"
}

# --- Help Message ---
show_usage() {
    cat << EOF
Usage: $(basename "${BASH_SOURCE[0]}") [OPTIONS] [COMMAND]

Automates dotfile synchronization and development environment setup.

Commands:
  sync        Synchronize dotfiles to home directory (default). Includes tool installation if enabled.
  link        List all available dotfiles for linking in the repository.
  pull        Pull changes from home directory (e.g., .gemini, .ssh) into the dotfiles repository.
  install     Install or update development tools (e.g., sccache, rustup).
  install-vim Install or update vim.
  help        Show this help message.

Options:
  -f, --force     Skip confirmation prompts for potentially destructive operations.
  -n, --dry-run   Show what would be done without executing any changes.
  -v, --verbose   Enable verbose output for commands like rsync.
  -b, --backup    Create a backup of existing files before overwriting (default: true).
  --no-backup     Skip creating backups.
  --config FILE   Use a custom configuration file instead of '${CONFIG_FILE_NAME}'.
  -h, --help      Display this help message and exit.

Examples:
  $(basename "${BASH_SOURCE[0]}")                 # Interactive sync with backup
  $(basename "${BASH_SOURCE[0]}") --force sync   # Force sync without confirmation
  $(basename "${BASH_SOURCE[0]}") --dry-run pull  # Preview pull operation
  $(basename "${BASH_SOURCE[0]}") install         # Install development tools only
  $(basename "${BASH_SOURCE[0]}") install-vim     # Install vim
  $(basename "${BASH_SOURCE[0]}") --config my_custom_config.conf sync # Use a custom config

Logging:
  All operations are logged to '${LOG_FILE_NAME}' in the script directory.
EOF
}

# --- Prerequisites Check ---
# Ensures necessary tools are installed and checks for basic system requirements.
check_prerequisites() {
    # Ensure script is not run as root
    if [[ "$EUID" -eq 0 ]]; then
        error "This script should not be run as root. Please run as a regular user."
        exit 1
    fi

    # Check for rsync
    if ! command_exists "rsync"; then
        error "'rsync' is required but not found. Please install it."
        exit 1
    fi

    # Check for essential tools needed by install_dev_tools (curl, sh, sudo)
    if ! command_exists "curl"; then
        warn "'curl' is not found. It may be needed for installing Rustup."
    fi
    if ! command_exists "sudo"; then
        warn "'sudo' is not found. Some tool installations may fail without it."
    fi

    # Check available disk space in home directory (as a rough check)
    local available_space
    available_space=$(df -k "$HOME_DIR" 2>/dev/null | awk 'NR==2 {print $4}') # df -k output varies slightly by OS
    if [[ -n "$available_space" && "$available_space" -lt 10240 ]]; then # Check if available_space is a number and less than 10MB
        warn "Low disk space: $(du -sh "$HOME_DIR" | awk '{print $1}') available in $HOME_DIR."
    fi
}

# --- Exclusion File Handling ---
# Reads exclusion patterns from EXCLUDE_FILE_NAME and prepares them for rsync.
get_exclusions() {
    local exclusions=()
    if [[ -f "$EXCLUDE_FILE_PATH" ]]; then
        echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') - Using exclusions from '$EXCLUDE_FILE_PATH')" >&2
        while IFS= read -r pattern || [[ -n "$pattern" ]]; do
            # Skip empty lines and comments
            [[ -n "$pattern" && ! "$pattern" =~ ^# ]] && exclusions+=("--exclude=$pattern")
        done < "$EXCLUDE_FILE_PATH"
    else
        # If exclude file is missing, warn and proceed without exclusions.
        echo "[WARN] $(date '+%Y-%m-%d %H:%M:%S') - Exclusion file '$EXCLUDE_FILE_PATH' not found. Rsync will proceed without exclusions for dotfiles synchronization." >&2
    fi
    printf '%s\n' "${exclusions[@]}"
}

# --- Backup Function ---
# Creates a backup of dotfiles that are about to be overwritten.
create_backup() {
    if [[ "$BACKUP" == "true" ]]; then
        local backup_dir="$HOME_DIR/dotfiles/backup_$(date +%Y%m%d_%H%M%S)"
        log "Creating backup of existing dotfiles in '$backup_dir'"
        mkdir -p "$backup_dir" || { error "Failed to create backup directory '$backup_dir'."; return 1; }

        local backup_count=0
        # Iterate over files in SCRIPT_DIR that are dotfiles (start with '.')
        find "$SCRIPT_DIR" -maxdepth 1 -type f -name '.*' ! -name '.git' | while read -r src_file; do
            local filename
            filename=$(basename "$src_file")
            local dest_file="$HOME_DIR/$filename"

            # Check if the destination file exists and is a regular file or symlink
            if [[ -f "$dest_file" || -L "$dest_file" ]]; then
                log "Backing up '$dest_file' to '$backup_dir/'"
                cp -p "$dest_file" "$backup_dir/" 2>/dev/null || warn "Failed to back up '$dest_file'."
                ((backup_count++))
            fi
        done

        if [[ $backup_count -gt 0 ]]; then
            success "Backup of $backup_count dotfiles created."
        else
            log "No existing dotfiles found to back up."
        fi
    else
        log "Backup process is disabled."
    fi
}

# --- Dotfiles Synchronization ---
# Synchronizes dotfiles from SCRIPT_DIR to HOME_DIR using rsync.
sync_dotfiles() {
    log "Syncing dotfiles to home directory..."

    local rsync_opts=(-avh --no-perms) # Archive, verbose, human-readable, no preserving permissions (safer for copying)
    # --itemize-changes may not be compatible with rsync 2.6.9, relying on -v for verbosity.
    # [[ "$DRY_RUN" == "true" ]] && rsync_opts+=(--itemize-changes)
    [[ "$VERBOSE" == "true" ]] && rsync_opts+=(-v)

    local exclusions_output
    declare -a exclusions_args=() # Explicitly declare as array and initialize as empty

    if [[ "$DRY_RUN" == "false" ]]; then
        exclusions_output=$(get_exclusions)
        if [[ -n "$exclusions_output" ]]; then
            # Use process substitution for Bash 3.2.57 compatibility
            while IFS= read -r exclusion; do
                exclusions_args+=("$exclusion")
            done < <(echo "$exclusions_output")
        fi
    fi
    # Construct the rsync command as a string for compatibility with older rsync versions (e.g., 2.6.9).
    # This avoids issues with array expansion and option parsing in older shells/rsync versions.
    local rsync_command_str="rsync ${rsync_opts[*]}"

    # Add exclusions as individual --exclude options to the command string
    # Safely check if exclusions_args is non-empty for Bash 3.2.57 with set -u
    if [[ "${#exclusions_args[@]}" -gt 0 ]]; then
        for exclusion in "${exclusions_args[@]}"; do
            rsync_command_str+=" $exclusion"
        done
    fi


    rsync_command_str+=" "$SCRIPT_DIR/" "$HOME_DIR/""

    if [[ "$DRY_RUN" == "true" ]]; then
        rsync_command_str+=" --dry-run"
    fi

    if [[ "$VERBOSE" == "true" ]]; then
        log "Executing rsync command: $rsync_command_str"
    fi


    if eval "$rsync_command_str"; then
        if [[ "$DRY_RUN" == "true" ]]; then
            log "Dry run complete. No changes were made."
        else
            success "Dotfiles synchronized successfully."
        fi
    else
        error "Failed to synchronize dotfiles."
        return 1
    fi
}

# --- List Dotfiles ---
# Lists available dotfiles in the script directory.
list_dotfiles() {
    log "Available dotfiles in repository:"
    # Find files starting with '.', excluding .git, and print their base names
    find "$SCRIPT_DIR" -maxdepth 1 -type f -name '.*' ! -name '.git' -exec basename {} \; | sort
}

# --- Pull Changes from Home ---
# Synchronizes specified directories from HOME_DIR back into the SCRIPT_DIR.
pull_changes() {
    log "Pulling changes from home directory into dotfiles repository..."

    # List of directories/files in HOME to synchronize back to dotfiles
    local sync_targets=(
        ".gemini"
        ".ssh/known_hosts"
        ".ssh/config"
        ".ssh/id_rsa_github"
        ".ssh/id_rsa_github.pub"
    )

    local changes_made=false

    for target in "${sync_targets[@]}"; do
        local home_path="$HOME_DIR/$target"
        # Determine the corresponding path within the dotfiles repository
        local repo_path="$SCRIPT_DIR/$target"
        local repo_dir=$(dirname "$repo_path")

        if [[ -e "$home_path" ]]; then # Check if source exists (file or dir)
            if [[ "$DRY_RUN" == "true" ]]; then
                log "Dry run: Would sync '$home_path' to '$repo_path'"
                changes_made=true # Mark that a change would have happened
                continue
            fi

            log "Syncing '$target'..."
            mkdir -p "$repo_dir" || { warn "Could not create directory '$repo_dir' for syncing '$target'."; continue; }

            # Use rsync for consistent syncing, preserving structure
            if rsync -av "$home_path" "$repo_dir/"; then
                success "Synced '$target'."
                changes_made=true
            else
                warn "Failed to sync '$target'."
            fi
        else
            log "Source '$home_path' does not exist. Skipping."
        fi
    done

    if [[ "$DRY_RUN" == "false" ]]; then
        if [[ "$changes_made" == "true" ]]; then
            # Show diff of changes made to the repository
            log "Showing diff of changes made to the dotfiles repository..."
            if ! git -C "$SCRIPT_DIR" diff --quiet HEAD --; then
                 git -C "$SCRIPT_DIR" diff --stat HEAD --
            else
                 log "No net changes detected in the dotfiles repository after sync."
            fi
        else
            log "No changes to pull from home directory."
        fi
    fi
}

# --- Development Tool Installation ---

# Installs Rust and sccache using rustup if they are not found.
install_rust_and_sccache_via_rustup() {
    if [[ "$INSTALL_RUSTUP" == "false" && "$INSTALL_SCCACHE" == "false" ]]; then
        log "Rustup and sccache installation is disabled by configuration."
        return
    fi

    if ! command_exists "cargo"; then
        if [[ "$INSTALL_RUSTUP" == "true" ]]; then
            log "Rust not found. Installing Rustup..."
            if command_exists "curl"; then
                log "Downloading Rustup installer..."
                # Use a temporary file for the installer script
                local rustup_installer=$(mktemp)
                curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o "$rustup_installer" || { error "Failed to download Rustup installer."; return 1; }

                log "Running Rustup installer..."
                # Run installer non-interactively with default options
                sh "$rustup_installer" -y || { error "Failed to install Rustup."; rm -f "$rustup_installer"; return 1; }
                rm -f "$rustup_installer"

                # Source the cargo environment to make 'cargo' command available
                log "Sourcing Rustup environment..."
                source "$HOME_DIR/.cargo/env" || warn "Could not source Rustup environment. You might need to restart your shell."
                success "Rustup installed."
            else
                error "'curl' is required to install Rustup but not found. Please install curl."
                return 1
            fi
        else
            warn "Rustup is not installed and INSTALL_RUSTUP is false. Skipping sccache installation via cargo."
            return 1
        fi
    else
        log "Rust (cargo) already installed: $(which cargo)"
        source "$HOME_DIR/.cargo/env" # Ensure environment is loaded if cargo exists
    fi

    if [[ "$INSTALL_SCCACHE" == "true" ]] && command_exists "cargo"; then
        if ! command_exists "sccache"; then
            log "Installing sccache via cargo..."
            cargo install sccache || { error "Failed to install sccache via cargo."; return 1; }
            success "sccache installed."
        else
            log "sccache already installed: $(which sccache)"
        fi
    elif [[ "$INSTALL_SCCACHE" == "false" ]]; then
        log "sccache installation is disabled by configuration."
    fi
    return 0
}

# Installs sccache using system package managers where possible.
install_sccache_via_package_manager() {
    if [[ "$INSTALL_SCCACHE" == "false" ]]; then
        log "sccache installation is disabled by configuration."
        return
    fi

    if ! command_exists "sccache"; then
        log "Attempting to install sccache using system package managers..."
        local installed=false

        if [[ "$(uname)" == "Darwin" ]]; then # macOS
            if command_exists "brew"; then
                log "Using Homebrew to install sccache..."
                if brew install sccache; then
                    success "sccache installed via Homebrew."
                    installed=true
                else
                    error "Failed to install sccache via Homebrew."
                fi
            else
                warn "Homebrew not found. Cannot install sccache via package manager on macOS."
            fi
        elif [[ "$(uname)" == "Linux" ]]; then
            if command_exists "apt-get"; then # Debian/Ubuntu
                log "Using apt-get to install sccache..."
                sudo apt-get update && sudo apt-get install -y sccache || { error "Failed to install sccache via apt-get."; return 1; }
                success "sccache installed via apt-get."
                installed=true
            elif command_exists "dnf"; then # Fedora/CentOS Stream
                log "Using dnf to install sccache..."
                sudo dnf install -y sccache || { error "Failed to install sccache via dnf."; return 1; }
                success "sccache installed via dnf."
                installed=true
            elif command_exists "pacman"; then # Arch Linux
                log "Using pacman to install sccache..."
                sudo pacman -S --noconfirm sccache || { error "Failed to install sccache via pacman."; return 1; }
                success "sccache installed via pacman."
                installed=true
            else
                warn "Could not determine Linux package manager (apt, dnf, pacman). Cannot install sccache via package manager."
            fi
        else
            warn "Unsupported OS for package manager installation. Cannot install sccache via package manager."
        fi

        if [[ "$installed" == "false" ]]; then
            # Fallback to cargo installation if package manager failed or not available
            install_rust_and_sccache_via_rustup
        fi
    else
        log "sccache already installed: $(which sccache)"
    fi
}

# Installs bash-completion via Homebrew if not already installed.
install_bash_completion() {
    if [[ "$(uname)" == "Darwin" ]]; then # Only applicable for macOS
        if [[ "$INSTALL_BASH_COMPLETION" == "false" ]]; then
            log "Bash completion installation is disabled by configuration."
            return
        fi

        if ! command_exists "brew"; then
            warn "Homebrew not found. Cannot install bash-completion."
            return 1
        fi

        if ! brew list bash-completion &>/dev/null; then
            log "Installing bash-completion via Homebrew..."
            if brew install bash-completion; then
                success "bash-completion installed via Homebrew."
            else
                error "Failed to install bash-completion via Homebrew."
                return 1
            fi
        else
            log "bash-completion already installed via Homebrew."
        fi

        # Define the complete block to be added to .bash_profile
        read -r -d '' bash_completion_source_block << 'EOF'
# Add tab completion for many Bash commands
if [ -f "$(brew --prefix)/etc/bash_completion" ]; then
    . "$(brew --prefix)/etc/bash_completion"
elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
fi
EOF

        # Check if the exact bash completion block is already present
        if ! grep -qF "${bash_completion_source_block}" "$HOME_DIR/.bash_profile"; then
            log "Adding/Updating bash-completion sourcing in ~/.bash_profile..."

            # Check if the old 'Add tab completion for many Bash commands' comment exists
            if grep -qF "# Add tab completion for many Bash commands" "$HOME_DIR/.bash_profile"; then
                # Delete the old comment line and any subsequent lines until the next non-empty line or end of file,
                # then append the correct block.
                sed -i '' "/^# Add tab completion for many Bash commands/,/^$/d" "$HOME_DIR/.bash_profile"
                echo -e "\n${bash_completion_source_block}" >> "$HOME_DIR/.bash_profile"
                success "Replaced old bash-completion section in ~/.bash_profile."
            else
                # If the comment doesn't exist, just append the block
                echo -e "\n${bash_completion_source_block}" >> "$HOME_DIR/.bash_profile"
                success "Appended bash-completion sourcing to ~/.bash_profile."
            fi
        else
            log "Bash-completion sourcing already present and correct in ~/.bash_profile."
        fi
    else
        log "Skipping bash-completion installation: Only applicable for macOS."
    fi
    return 0
}

# Main function for development tool installation.
install_dev_tools() {
    log "Setting up development tools..."

    # macOS specific: Developer mode enablement
    if [[ "$(uname)" == "Darwin" ]]; then
        # Check if assessments are enabled (a prerequisite for developer mode)
        local assessments_enabled=false
        if spctl --status 2>/dev/null | grep -q "Assessments enabled."; then
            assessments_enabled=true
        fi

        if [[ "$FORCE" == "true" || "$assessments_enabled" == "true" ]]; then
            log "Ensuring developer mode is enabled on macOS..."
            # Check if 'developer-mode' subcommand is supported by checking general spctl help output
            if _is_developer_mode_supported; then
                # New macOS versions support 'developer-mode enable-terminal'
                if sudo spctl developer-mode enable-terminal; then
                    success "Developer mode enabled using 'developer-mode enable-terminal'."
                else
                    warn "Failed to enable developer mode with 'developer-mode enable-terminal'. It might already be enabled, or requires manual intervention."
                fi

            fi
        else
            warn "Developer mode enablement skipped: Assessments are not enabled and --force flag was not used."
        fi
    fi

    # Install sccache
    if [[ "$INSTALL_SCCACHE" == "true" ]]; then
        if ! command_exists "sccache"; then
            install_sccache_via_package_manager
            # If package manager failed and rustup installation was allowed, it might have installed it
            if ! command_exists "sccache" && [[ "$INSTALL_RUSTUP" == "true" ]]; then
                # Double check by trying rustup if package manager failed
                install_rust_and_sccache_via_rustup
            fi
        else
            log "sccache already installed: $(which sccache)"
        fi
    else
        log "sccache installation is disabled by configuration."
    fi

    # Set RUSTC_WRAPPER if sccache is installed
    if command_exists "sccache"; then
        local sccache_path
        sccache_path="$(which sccache)"
        if [[ "${RUSTC_WRAPPER:-}" != "$sccache_path" ]]; then # Only log if changing
            export RUSTC_WRAPPER="$sccache_path"
            log "RUSTC_WRAPPER set to '$RUSTC_WRAPPER'"
        fi
    else
        warn "sccache is not installed or not found in PATH. RUSTC_WRAPPER not set."
    fi

    # Install bash-completion
    install_bash_completion

    success "Development tools setup complete."
}
# Main function to invoke install-vim.sh
install_vim() {
    log "Install Vim Dialogue"

    # macOS specific: Developer mode enablement
    if [[ "$(uname)" == "Darwin" ]]; then
        # Check if assessments are enabled (a prerequisite for developer mode)
        local assessments_enabled=false
        if spctl --status 2>/dev/null | grep -q "Assessments enabled."; then
            assessments_enabled=true
        fi

        if [[ "$FORCE" == "true" || "$assessments_enabled" == "true" ]]; then
            log "Ensuring developer mode is enabled on macOS..."
            # Check if 'developer-mode' subcommand is supported.
            if _is_developer_mode_supported; then
                # New macOS versions support 'developer-mode enable-terminal'
                if sudo spctl developer-mode enable-terminal; then
                    success "Developer mode enabled using 'developer-mode enable-terminal'."
                else
                    warn "Failed to enable developer mode with 'developer-mode enable-terminal'. It might already be enabled, or requires manual intervention."
                fi
            fi
        else
            warn "Developer mode enablement skipped: Assessments are not enabled and --force flag was not used."
        fi
    fi

    ./scripts/install-vim.sh
    success "Installed vim!"
}

# --- Main Execution Logic ---
main() {
    # Initialize log file
    # Ensure LOG_FILE_PATH is correctly set based on SCRIPT_DIR and LOG_FILE_NAME
    if [[ -z "$LOG_FILE_PATH" ]]; then
        LOG_FILE_PATH="$SCRIPT_DIR/$LOG_FILE_NAME"
    fi
    touch "$LOG_FILE_PATH" # Ensure log file exists
    log "--------------------------------------------------"
    log "Bootstrap script initialized."
    log "Script Directory: $SCRIPT_DIR"
    log "Home Directory: $HOME_DIR"
    log "--------------------------------------------------"

    # Load configuration first
    load_config

    # Parse command line arguments, potentially overriding config file
    parse_arguments "$@"

    # Execute the chosen command
    case "$BOOTSTRAP_COMMAND" in
        "sync")
            if [[ "$FORCE" != "true" ]]; then
                echo -n "This operation may overwrite existing files in your home directory. Are you sure? (y/N): "
                read -r response
                if [[ ! "$response" =~ ^[Yy]$ ]]; then
                    log "Operation cancelled by user."
                    exit 0
                fi
            fi
            create_backup || error "Backup creation failed. Continuing with sync..."
            sync_dotfiles

            # Optionally install tools if sync is performed and enabled
            if [[ "$INSTALL_SCCACHE" == "true" ]]; then
                install_dev_tools
            fi
            ;;
        "link")
            list_dotfiles
            ;;
        "pull")
            if [[ "$DRY_RUN" == "true" ]]; then
                pull_changes
            else
                if [[ "$FORCE" != "true" ]]; then
                    echo -n "This operation will copy files from your home directory back into the repository. Are you sure? (y/N): "
                    read -r response
                    if [[ ! "$response" =~ ^[Yy]$ ]]; then
                        log "Operation cancelled by user."
                        exit 0
                    fi
                fi
                pull_changes
            fi
            ;;
        "install")
            install_dev_tools
            ;;
        "install-vim")
            install_vim
            ;;
        *)
            # This case should ideally not be reached due to parse_arguments handling unknown commands.
            error "Invalid command '$BOOTSTRAP_COMMAND' processed."
            show_usage
            exit 1
            ;;
    esac

    log "Bootstrap script finished."
    success "All requested operations completed."
}

# Execute main function with script arguments
main "$@"
