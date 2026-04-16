#!/usr/bin/env python3
import os
import sys

def sort_gitignore(file_path):
    """Sorts a single .gitignore file alphabetically, preserving comments."""
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    print(f"Processing: {file_path}")

    with open(file_path, "r") as f:
        lines = f.readlines()

    # Create a backup
    backup_path = file_path + ".bak"
    with open(backup_path, "w") as f:
        f.writelines(lines)
    
    processed_blocks = []
    current_comments = []
    seen_entries = set()

    for line in lines:
        stripped = line.strip()
        
        if not stripped:
            continue
            
        if stripped.startswith("#"):
            current_comments.append(line)
        else:
            if stripped not in seen_entries:
                # Combine comments + the entry into one sortable block
                # We handle the newline to ensure the block is self-contained
                entry_line = line if line.endswith('\n') else line + '\n'
                block = "".join(current_comments) + entry_line
                processed_blocks.append(block)
                seen_entries.add(stripped)
            current_comments = []

    # Sort blocks based on the last line (the actual pattern)
    processed_blocks.sort(key=lambda x: x.strip().split('\n')[-1].lower())

    with open(file_path, "w") as f:
        f.writelines(processed_blocks)

    print(f"Successfully sorted and backed up: {file_path}")

def find_and_sort_all(root_dir):
    """Recursively finds all .gitignore files starting from root_dir."""
    found_any = False
    for root, dirs, files in os.walk(root_dir):
        if ".gitignore" in files:
            found_any = True
            full_path = os.path.join(root, ".gitignore")
            sort_gitignore(full_path)
    
    if not found_any:
        print(f"No .gitignore files found in {root_dir}")

if __name__ == "__main__":
    # If a directory or file is passed, use it; otherwise, use current directory
    target_path = sys.argv[1] if len(sys.argv) > 1 else "."
    
    if os.path.isdir(target_path):
        print(f"Starting recursive search in: {os.path.abspath(target_path)}")
        find_and_sort_all(target_path)
    elif os.path.isfile(target_path):
        sort_gitignore(target_path)
    else:
        print(f"Path not found: {target_path}")
