#!/bin/bash

# Define the backup directory
BACKUP_DIR="${HOME}/CommandLineTools_backup_$(date +%Y%m%d_%H%M%S)"

echo "Starting CommandLineTools update process..."

# Create the backup directory
echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Move existing CommandLineTools to backup
if [ -d "/Library/Developer/CommandLineTools" ]; then
  echo "Backing up existing CommandLineTools to: $BACKUP_DIR"
  sudo mv /Library/Developer/CommandLineTools "$BACKUP_DIR"
  if [ $? -eq 0 ]; then
    echo "Backup successful."
  else
    echo "Error: Failed to backup CommandLineTools."
    exit 1
  fi
else
  echo "No existing CommandLineTools found at /Library/Developer/CommandLineTools. Skipping backup."
fi

# Install new CommandLineTools
echo "Initiating installation of new CommandLineTools..."
sudo xcode-select --install

echo "CommandLineTools update process completed. Please check for any prompts during installation."
