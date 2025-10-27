#!/usr/bin/env sh

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash || wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

echo node > .nvmrc
nvm install

# This script installs the Gemini CLI globally.
# It attempts to install Node.js and npm if they are not found.

# --- Helper function to check for command existence ---
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# --- OS Detection ---
OS="$(uname)"
PACKAGE_MANAGER=""

if [[ "$OS" == "Darwin" ]]; then
    # macOS
    if command_exists brew;
    then
        PACKAGE_MANAGER="brew"
    else
        echo "Error: Homebrew not found. Please install Homebrew first (https://brew.sh/)."
        echo "Then run: brew install node"
        exit 1
    fi
elif [[ "$OS" == *"Linux"* ]]; then
    # Linux
    if command_exists apt-get;
    then
        PACKAGE_MANAGER="apt-get"
    elif command_exists dnf;
    then
        PACKAGE_MANAGER="dnf"
    elif command_exists yum;
    then
        PACKAGE_MANAGER="yum"
    else
        echo "Error: Could not detect a supported package manager (apt-get, dnf, yum)."
        echo "Please install Node.js and npm manually from https://nodejs.org/ or using your system's package manager."
        exit 1
    fi
else
    echo "Error: Unsupported operating system '$OS'."
    echo "Please install Node.js and npm manually from https://nodejs.org/."
    exit 1
fi

# --- Node.js and npm Installation/Check ---

NODE_INSTALLED=false
NPM_INSTALLED=false

if command_exists node;
then
    echo "Node.js is already installed."
    NODE_INSTALLED=true
else
    echo "Node.js not found. Attempting to install..."
    INSTALL_CMD=""
    if [[ "$PACKAGE_MANAGER" == "brew" ]]; then
        INSTALL_CMD="brew install node"
    elif [[ "$PACKAGE_MANAGER" == "apt-get" ]]; then
        INSTALL_CMD="sudo apt-get update && sudo apt-get install -y nodejs npm"
    elif [[ "$PACKAGE_MANAGER" == "dnf" ]]; then
        INSTALL_CMD="sudo dnf install -y nodejs"
    elif [[ "$PACKAGE_MANAGER" == "yum" ]]; then
        INSTALL_CMD="sudo yum install -y nodejs"
    fi

    if [[ -n "$INSTALL_CMD" ]]; then
        echo "Running: $INSTALL_CMD"
        if eval "$INSTALL_CMD"; then
            echo "Node.js installation successful."
            NODE_INSTALLED=true
        else
            echo "Error: Failed to install Node.js using '$INSTALL_CMD'."
            echo "Please check the output above and try installing Node.js and npm manually from https://nodejs.org/."
            exit 1
        fi
    else
        echo "Error: No installation command determined for Node.js."
        exit 1
    fi
fi

# Check npm status
if command_exists npm;
then
    echo "npm is already installed."
    NPM_INSTALLED=true
else
    echo "npm not found. Attempting to install/update npm..."
    # If node was installed, npm should ideally be installed with it.
    # If not, or if node was already present but npm was missing, try to install/update npm.
    if [[ "$NODE_INSTALLED" == true ]]; then
        echo "Attempting to install/update npm using 'npm install -g npm'..."
        if npm install -g npm; then
            echo "npm installation/update successful."
            NPM_INSTALLED=true
        else
            echo "Error: Failed to install/update npm."
            echo "Please check the output above and try installing npm manually."
            exit 1
        fi
    else
        echo "Error: npm is not installed and Node.js installation also failed."
        exit 1
    fi
fi

# --- Gemini CLI Installation ---

if [ "$NODE_INSTALLED" = true ] && [ "$NPM_INSTALLED" = true ]; then
    echo "Node.js and npm are available. Proceeding with gemini-cli installation."
    echo "Installing @google/gemini-cli globally..."

    if ! npm install -g @google/gemini-cli; then
        echo "Error: Failed to install @google/gemini-cli."
        echo "Please check the npm output above for details."
        exit 1
    fi

    echo "gemini-cli has been installed successfully."
    echo "You can now use the 'gemini' command."
else
    echo "Error: Node.js and/or npm are not installed or could not be installed."
    echo "Please ensure Node.js and npm are installed and available in your PATH."
    exit 1
fi

gemini extensions install https://github.com/github/github-mcp-server
gemini extensions install https://github.com/gemini-cli-extensions/genkit

exit 0
>>>>>>> 9f94bc3ca5 (scripts/install-gemini-cli.sh)
