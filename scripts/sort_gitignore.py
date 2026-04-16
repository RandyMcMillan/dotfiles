import os
import sys

def sort_gitignore(file_path=".gitignore"):
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    # Read the file lines
    with open(file_path, "r") as f:
        lines = f.readlines()

    # Create a backup
    backup_path = file_path + ".bak"
    with open(backup_path, "w") as f:
        f.writelines(lines)
    print(f"Backup created at {backup_path}")

    processed_blocks = []
    current_comments = []
    seen_entries = set()

    for line in lines:
        stripped = line.strip()
        
        # Keep empty lines as they are or skip them to condense
        if not stripped:
            continue
            
        # If it's a comment, store it to attach to the next actual entry
        if stripped.startswith("#"):
            current_comments.append(line)
        else:
            # Avoid duplicates
            if stripped not in seen_entries:
                # Combine comments + the entry into one sortable block
                block = "".join(current_comments) + line
                processed_blocks.append(block)
                seen_entries.add(stripped)
            current_comments = []

    # Sort the blocks alphabetically (case-insensitive)
    processed_blocks.sort(key=lambda x: x.split('\n')[-2].lower() if x.endswith('\n') else x.split('\n')[-1].lower())

    # Write back to the original file
    with open(file_path, "w") as f:
        f.writelines(processed_blocks)

    print(f"Successfully sorted {file_path}!")

if __name__ == "__main__":
    # Check if a specific path was provided as an argument
    target = sys.argv[1] if len(sys.argv) > 1 else ".gitignore"
    sort_gitignore(target)
