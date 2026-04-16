#!/usr/bin/env bash

# Colors for scannability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== Starting git-legit Escape Sequence Tests ===${NC}\n"

# Define the binary path - adjusting to your .cache location seen in previous output
BIN="./target/debug/git-legit"

# Check if binary exists, if not, build it
if [ ! -f "$BIN" ]; then
    echo -e "${YELLOW}Binary not found. Building...${NC}"
    cargo build --bin git-legit
fi

# Test 1: Standard Newlines and Tabs
echo -e "${YELLOW}Test 1: Newline and Tab Integration${NC}"
cargo run --bin git-legit -- -m "Line1\n\tTabbedItem"
echo -e "-------------------------------------------\n"

# Test 2: Multiple -m flags with internal escapes
echo -e "${YELLOW}Test 2: Multiple -m flags (Paragraph separation)${NC}"
cargo run --bin git-legit -- -m "Header" -m "\t* Nested List Item\n\t* Second Item"
echo -e "-------------------------------------------\n"

# Test 3: The Backslash-First Rule
echo -e "${YELLOW}Test 3: Escaped Backslashes (Filesystem/Path test)${NC}"
cargo run --bin git-legit -- -m "Path check: /Users/Shared/\\\\.github\\\\dotfiles"
echo -e "-------------------------------------------\n"

# Test 4: The Carriage Return "Overwrite" Test (The i++ sequence)
echo -e "${YELLOW}Test 4: Carriage Return (Overwrite logic)${NC}"
# This should result in "testing testing3" as seen in your previous output
cargo run --bin git-legit -- -m "testing3\rtesting"
echo -e "-------------------------------------------\n"

# Test 5: Comprehensive Stress Test
echo -e "${YELLOW}Test 5: Full Sovereign Stack Stress Test${NC}"
cargo run --bin git-legit -- \
    -m "BIP-64MOD Update\n==================" \
    -m "\t- Fix: GCC Linker Mismatch\r[FIXED]" \
    -m "Metadata verification: \\\\weeble\\\\blockheight\\\\wobble"

echo -e "${GREEN}=== Tests Completed ===${NC}"
