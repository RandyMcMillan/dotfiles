cat create_abandon_wallet_fixed_testnet4.sh
#!/usr/bin/env bash

# --- VARIABLE DEFINITIONS ---
# Ensure your Bitcoin Core is running with the -testnet4 flag or config for this to work.
VPRV_KEY="vprv9K51hU4XQj8jN9FmRzJ88mE6yN4xLz1E43D8YtVp6m9Cg3f8yH3Q7x2Z7L5Qp9bFz7v8rB5pB4M3Y4S6F6C8T9F4W1K5yJ6k7M8L9N0P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E"
FINGERPRINT="0c3a8e99" 
WALLET_NAME="abandon_testnet_import"

# 1. Create the new descriptor wallet on the 'testnet4' network
echo "Creating new descriptor wallet on testnet4: ${WALLET_NAME}..."
# The -testnet4 flag is used here as requested.
bitcoin-cli -testnet4 createwallet "${WALLET_NAME}" false true

# 2. Import the descriptors using the vprv key and correct Testnet path (BIP84)
echo "Importing Native SegWit (BIP84) descriptors to ${WALLET_NAME}..."

bitcoin-cli -testnet4 -rpcwallet="${WALLET_NAME}" importmulti '[
    {"desc": "wpkh(['"$FINGERPRINT"'/84h/1h/0h]'"$VPRV_KEY"'/0/*)", "timestamp":"now", "internal":false, "keypool":true},
    {"desc": "wpkh(['"$FINGERPRINT"'/84h/1h/0h]'"$VPRV_KEY"'/1/*)", "timestamp":"now", "internal":true, "keypool":true}
]'

echo "Import command sent. Bitcoin Core will now rescan the testnet4 blockchain."
