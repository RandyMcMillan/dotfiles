#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CONFIG_FILE="${SCRIPT_DIR}/.bootstrapconfig"
readonly EXCLUDE_FILE="${SCRIPT_DIR}/.bootstrapignore"
readonly SESSION_LOG="${HOME}/session.log"
readonly BACKUP_DIR="${HOME}/.dotfiles_backup_$(date +%Y%m%d_%H%M%S)"

# Default configuration
DRY_RUN=false
VERBOSE=false
FORCE=false
BACKUP=true

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "$SESSION_LOG"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $*" | tee -a "$SESSION_LOG"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $*" | tee -a "$SESSION_LOG"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" | tee -a "$SESSION_LOG" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*" | tee -a "$SESSION_LOG"
}

show_usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS] [COMMAND]

Commands:
    sync        Sync dotfiles to home directory (default)
    link        List all available dotfiles for linking
    pull        Pull changes from home directory to dotfiles
    install     Install development tools (sccache, etc.)
    help        Show this help message

Options:
    -f, --force     Skip confirmation prompts
    -n, --dry-run   Show what would be done without executing
    -v, --verbose   Enable verbose output
    -b, --backup    Create backup before overwriting (default: true)
    --no-backup     Skip creating backups
    --config FILE   Use custom config file

Examples:
    bootstrap.sh                 # Interactive sync with backup
    bootstrap.sh --force sync    # Force sync without confirmation
    bootstrap.sh --dry-run pull  # Preview pull operation
    bootstrap.sh install         # Install development tools only
EOF
}

load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        source "$CONFIG_FILE"
    fi
}

check_prerequisites() {
    if [[ "$EUID" -eq 0 ]]; then
        error "This script should not be run as root"
        exit 1
    fi

    if ! command -v rsync >/dev/null 2>&1; then
        error "rsync is required but not installed"
        exit 1
    fi

    local available_space
    available_space=$(df -k "$HOME" | awk 'NR==2 {print $4}')
    if [[ $available_space -lt 10240 ]]; then
        warn "Low disk space: ${available_space}KB available"
    fi
}

get_exclusions() {
    local exclusions=()
    
    if [[ -f "$EXCLUDE_FILE" ]]; then
        while IFS= read -r pattern; do
            [[ -n "$pattern" && ! "$pattern" =~ ^# ]] && exclusions+=("--exclude=$pattern")
        done < "$EXCLUDE_FILE"
    else
        # Fallback exclusions if file doesn't exist
        exclusions=(
            --exclude=".cargo/debug" --exclude=".cargo/release" --exclude="target"
            --exclude=".DS_Store" --exclude=".gitconfig" --exclude=".nojekyll"
            --exclude=".venv" --exclude=".osx" --exclude="scripts" --exclude="src"
            --exclude=".git/" --exclude=".github/" --exclude="**.sh" --exclude="**.bash"
            --exclude="**akefile**" --exclude=".vim_runtime/.git/"
            --exclude="README.md" --exclude="LICENSE*" --exclude="INSTALL"
            --exclude="AUTHORS" --exclude="ChangeLog" --exclude="NEWS" --exclude="TIME"
        )
    fi
    
    printf '%s\n' "${exclusions[@]}"
}

create_backup() {
    if [[ "$BACKUP" == "true" ]]; then
        info "Creating backup in $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
        
        # Backup existing dotfiles that will be overwritten
        find "$SCRIPT_DIR" -maxdepth 1 -name ".*" -type f ! -name ".git" | while read -r file; do
            local basename
            basename=$(basename "$file")
            local home_file="${HOME}/${basename}"
            
            if [[ -f "$home_file" || -L "$home_file" ]]; then
                cp -p "$home_file" "$BACKUP_DIR/" 2>/dev/null || true
            fi
        done
        
        success "Backup created"
    fi
}

sync_dotfiles() {
    info "Syncing dotfiles to home directory"
    
    local rsync_cmd=(rsync -avh --no-perms)
    [[ "$DRY_RUN" == "true" ]] && rsync_cmd+=(--dry-run)
    [[ "$VERBOSE" == "true" ]] && rsync_cmd+=(-v)
    
    # Add exclusions
    while IFS= read -r exclusion; do
        rsync_cmd+=("$exclusion")
    done < <(get_exclusions)
    
    rsync_cmd+=("$SCRIPT_DIR/" "$HOME/")
    
    if [[ "$VERBOSE" == "true" ]]; then
        info "Command: ${rsync_cmd[*]}"
    fi
    
    if "${rsync_cmd[@]}"; then
        success "Dotfiles synced successfully"
    else
        error "Failed to sync dotfiles"
        return 1
    fi
}

list_dotfiles() {
    info "Available dotfiles:"
    find "$SCRIPT_DIR" -maxdepth 1 -name ".*" -type f ! -name ".git" -exec basename {} \; | sort
}

pull_changes() {
    info "Pulling changes from home directory"
    
    local dirs=(".gemini" ".ssh/known_hosts")
    
    for dir in "${dirs[@]}"; do
        local home_path="${HOME}/${dir}"
        local dotfiles_path="${SCRIPT_DIR}/${dir##*/}"
        
        if [[ -d "$home_path" ]]; then
            info "Syncing $dir"
            if [[ "$DRY_RUN" == "false" ]]; then
                mkdir -p "$(dirname "$dotfiles_path")"
                rsync -av "$home_path/" "$dotfiles_path/" || warn "Failed to sync $dir"
            fi
        fi
    done
    
    if [[ "$DRY_RUN" == "false" ]]; then
        git -C "$SCRIPT_DIR" diff --stat
    fi
}

install_dev_tools() {
    info "Installing development tools"
    
    # Enable developer mode on macOS
    if [[ "$(uname)" == "Darwin" ]]; then
        info "Enabling developer mode"
        sudo spctl developer-mode enable-terminal || warn "Failed to enable developer mode"
    fi
    
    # Install sccache for Rust compilation
    if ! command -v sccache >/dev/null 2>&1; then
        info "Installing sccache"
        if command -v cargo >/dev/null 2>&1; then
            cargo install sccache || error "Failed to install sccache via cargo"
        else
            info "Installing Rust first"
            curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
            source "$HOME/.cargo/env"
            cargo install sccache || error "Failed to install sccache"
        fi
    else
        info "sccache already installed: $(which sccache)"
    fi
    
    # Set up sccache environment
    export RUSTC_WRAPPER="$(which sccache)"
    
    success "Development tools installation complete"
}

handle_sudo_operations() {
    if [[ "$EUID" -eq 0 ]]; then
        warn "Running as root - installing bash_sessions"
        
        local bash_sessions_dir="${SCRIPT_DIR}/../bash_sessions"
        if [[ -d "$bash_sessions_dir" ]]; then
            chmod +x "$bash_sessions_dir"
            install -d /usr/local
            install "$bash_sessions_dir" /usr/local/bash_sessions || warn "Failed to install bash_sessions"
        fi
    fi
}

get_argument() {
    local arg="$1"
    # Check both $1 and $2 for compatibility with original script
    [[ -n "$arg" ]] && echo "$arg"
}

main() {
    # Initialize session log
    touch "$SESSION_LOG"
    log "Bootstrap script started"
    
    # Load configuration
    load_config
    
    # Parse command line arguments
    local command="sync"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--force) FORCE=true; shift ;;
            -n|--dry-run) DRY_RUN=true; shift ;;
            -v|--verbose) VERBOSE=true; shift ;;
            -b|--backup) BACKUP=true; shift ;;
            --no-backup) BACKUP=false; shift ;;
            --config) CONFIG_FILE="$2"; shift 2 ;;
            -h|--help) command="help"; shift ;;
            sync|link|pull|install|help)
                command="$1"; shift ;;
            *) error "Unknown option: $1"; show_usage; exit 1 ;;
        esac
    done
    
    # Show help if requested
    if [[ "$command" == "help" ]]; then
        show_usage
        exit 0
    fi
    
    # Check prerequisites
    check_prerequisites
    
    # Execute command
    case "$command" in
        "sync")
            if [[ "$FORCE" != "true" ]]; then
                echo -n "This may overwrite existing files in your home directory. Are you sure? (y/n) "
                read -r response
                if [[ ! "$response" =~ ^[Yy]$ ]]; then
                    info "Operation cancelled"
                    exit 0
                fi
            fi
            create_backup
            sync_dotfiles
            install_dev_tools
            ;;
        "link")
            list_dotfiles
            ;;
        "pull")
            pull_changes
            ;;
        "install")
            install_dev_tools
            ;;
        *)
            error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
    
    # Handle any sudo operations
    handle_sudo_operations
    
    log "Bootstrap script completed successfully"
    success "All operations completed"
}

# Run main function with all arguments
main "$@"