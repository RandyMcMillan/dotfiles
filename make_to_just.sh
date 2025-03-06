#!/usr/bin/env bash

# Name of the Makefile to be converted
MAKEFILE="GNUmakefile"

# Name of the output Justfile
JUSTFILE=".justfile"

# Check if the Makefile exists
if [ ! -f "$MAKEFILE" ]; then
    echo "Makefile not found"
    exit 1
fi

# Clear the Justfile content
> "$JUSTFILE"

# Add in the default recipe to Justfile
echo "default:" >> "$JUSTFILE"
echo -e "  just --list\n" >> "$JUSTFILE"

# Read each line in the Makefile
while IFS= read -r line
do
    # Extract target names (lines ending with ':')
    if [[ "$line" =~ ^[a-zA-Z0-9_-]+: ]]; then
        # Extract the target name
        target_name=$(echo "$line" | cut -d':' -f1)

        # Write the corresponding recipe to Justfile
        echo "$target_name:" >> "$JUSTFILE"
        echo -e "  make $target_name\n" >> "$JUSTFILE"
    fi
done < "$MAKEFILE"

echo "Successfully ported the Makefile to Justfile."
