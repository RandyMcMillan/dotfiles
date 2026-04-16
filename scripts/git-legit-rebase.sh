#!/usr/bin/env bash

# Exit on error
set -e

# Colors for the Sovereign Terminal
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

show_help() {
    echo "Usage: $0 --depth <N>"
    echo "Rewrites the last N commits using git-legit for PoW mining and metadata injection."
}

# Parse Arguments
DEPTH=""
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --depth) DEPTH="$2"; shift ;;
        -h|--help) show_help; exit 0 ;;
        *) echo -e "${RED}Unknown parameter: $1${NC}"; exit 1 ;;
    esac
    shift
done

if [[ -z "$DEPTH" ]]; then
    show_help
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}Error: Your worktree has uncommitted changes.${NC}"
    exit 1
fi

echo -e "${CYAN}=== Starting Sovereign Rebase (Depth: $DEPTH) ===${NC}"

TMP_DIR=$(mktemp -d)

# 1. Capture history
for i in $(seq 0 $((DEPTH - 1))); do
    REV="HEAD~$i"
    git log -1 --pretty=%B "$REV" > "$TMP_DIR/msg_$((DEPTH - 1 - i)).txt"
    git format-patch -1 "$REV" --stdout > "$TMP_DIR/patch_$((DEPTH - 1 - i)).patch"
done

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${YELLOW}Detaching HEAD to $(git rev-parse HEAD~$DEPTH)...${NC}"
git checkout HEAD~$DEPTH

# 2. Re-apply using Rust binary logic
for i in $(seq 0 $((DEPTH - 1))); do
    MSG_FILE="$TMP_DIR/msg_$i.txt"
    PATCH_FILE="$TMP_DIR/patch_$i.patch"

    echo -e "${CYAN}Applying commit $((i + 1)) of $DEPTH...${NC}"

    git apply --index "$PATCH_FILE"

    # Pass the RAW message. The Rust binary now handles prefix stripping.
    cargo run --bin git-legit -- -m "$(cat "$MSG_FILE")"

    rm "$PATCH_FILE" "$MSG_FILE"
done

echo -e "\n${GREEN}=== Sovereign Rebase Complete ===${NC}"
echo -e "${CYAN}Run: git branch -f $CURRENT_BRANCH HEAD && git checkout $CURRENT_BRANCH${NC}"

rm -rf "$TMP_DIR"
