#!/bin/bash

OP_RETURN_DATA="Hello From @RandyMcMillan $(date +%s)" # Data to embed in OP_RETURN

# Configuration
NUM_TRANSACTIONS=25        # Number of transactions to create
AMOUNT_PER_OUTPUT=0.00001  # BTC amount for each recipient output
INITIAL_FEE_RATE=1         # Starting fee rate in sat/vB
FEE_RATE_INCREMENT=1       # Increment for fee rate per transaction

echo "Starting mempool population script for testnet..."
echo "Creating $NUM_TRANSACTIONS transactions, starting with fee rate $INITIAL_FEE_RATE sat/vB"

# Check if bitcoin-cli is available
if ! command -v bitcoin-cli &> /dev/null
then
    echo "Error: bitcoin-cli not found. Please ensure Bitcoin Core is installed and in your PATH."
    exit 1
fi

# Get a new address to receive change (and for initial funding if needed)
CHANGE_ADDRESS=$(bitcoin-cli --testnet4 getnewaddress "mempool_filler_change")
echo "Using change address: $CHANGE_ADDRESS"

# Get an initial unspent transaction output (UTXO) from your wallet
# This assumes your wallet already has some funds.
# If this fails, you need to fund your wallet first.
echo "Searching for an initial UTXO in your wallet..."
INITIAL_UTXO=$(bitcoin-cli --testnet4 listunspent 1 999999 '[]' true '{"minimumAmount":0.0001}' | jq -r '.[0]')

if [ -z "$INITIAL_UTXO" ] || [ "$INITIAL_UTXO" == "null" ]; then
    echo "Error: No suitable UTXO found in your wallet. Please ensure your testnet wallet has funds."
    echo "You can send some testnet coins to: $CHANGE_ADDRESS"
    exit 1
fi

CURRENT_TXID=$(echo "$INITIAL_UTXO" | jq -r '.txid')
CURRENT_VOUT=$(echo "$INITIAL_UTXO" | jq -r '.vout')
CURRENT_AMOUNT=$(echo "$INITIAL_UTXO" | jq -r '.amount')

echo "Initial UTXO: $CURRENT_TXID:$CURRENT_VOUT (Amount: $CURRENT_AMOUNT BTC)"

CURRENT_FEE_RATE=$INITIAL_FEE_RATE

for i in $(seq 1 $NUM_TRANSACTIONS); do
    echo "--- Transaction $i ---"

    # Generate a new recipient address for each transaction
    RECIPIENT_ADDRESS=$(bitcoin-cli --testnet4 getnewaddress "mempool_recipient_$i")

    # Create a raw transaction: spend CURRENT_UTXO, send to RECIPIENT_ADDRESS
    # fundrawtransaction will add the change output and calculate the fee
    INPUTS="[{\"txid\":\"$CURRENT_TXID\",\"vout\":$CURRENT_VOUT}]"
    OUTPUTS="{\"$RECIPIENT_ADDRESS\":$AMOUNT_PER_OUTPUT, \"data\":\"$(echo -n $OP_RETURN_DATA | xxd -p -c 200)\"}"

    RAW_TX_HEX=$(bitcoin-cli --testnet4 createrawtransaction "$INPUTS" "$OUTPUTS")

    # Fund the raw transaction, specifying the fee rate and change address
    FUNDED_TX_JSON=$(bitcoin-cli --testnet4 fundrawtransaction "$RAW_TX_HEX" '{"fee_rate":'$CURRENT_FEE_RATE', "changeAddress":"'$CHANGE_ADDRESS'"}')
    FUNDED_TX_HEX=$(echo "$FUNDED_TX_JSON" | jq -r '.hex')
    FEE=$(echo "$FUNDED_TX_JSON" | jq -r '.fee')

    echo "  Fee rate: $CURRENT_FEE_RATE sat/vB, Estimated Fee: $FEE BTC"

    # Sign the funded transaction
    SIGNED_TX_JSON=$(bitcoin-cli --testnet4 signrawtransactionwithwallet "$FUNDED_TX_HEX")
    SIGNED_TX_HEX=$(echo "$SIGNED_TX_JSON" | jq -r '.hex')
    COMPLETE=$(echo "$SIGNED_TX_JSON" | jq -r '.complete')

    if [ "$COMPLETE" != "true" ]; then
        echo "Error: Failed to sign transaction $i. Check wallet funds or script logic."
        echo "$SIGNED_TX_JSON"
        exit 1
    fi

    # Broadcast the transaction
    BROADCAST_TXID=$(bitcoin-cli --testnet4 sendrawtransaction "$SIGNED_TX_HEX")
    echo "  Broadcasted TXID: $BROADCAST_TXID"

    # Find the change output from the broadcasted transaction to use as the next UTXO
    DECODED_TX=$(bitcoin-cli --testnet4 decoderawtransaction "$SIGNED_TX_HEX")
    CHANGE_VOUT_INDEX=-1
    for j in $(seq 0 $(($(echo "$DECODED_TX" | jq '.vout | length') - 1))); do
        SCRIPT_PUB_KEY_ADDRESS=$(echo "$DECODED_TX" | jq -r ".vout[$j].scriptPubKey.address")
        if [ "$SCRIPT_PUB_KEY_ADDRESS" == "$CHANGE_ADDRESS" ]; then
            CHANGE_VOUT_INDEX=$j
            break
        fi
    done

    if [ "$CHANGE_VOUT_INDEX" -eq -1 ]; then
        echo "Error: Could not find change output for transaction $i. This is unexpected. Exiting."
        exit 1
    fi

    CURRENT_TXID=$BROADCAST_TXID
    CURRENT_VOUT=$CHANGE_VOUT_INDEX
    CURRENT_AMOUNT=$(echo "$DECODED_TX" | jq -r ".vout[$CURRENT_VOUT].value")
    echo "  Next UTXO for spending: $CURRENT_TXID:$CURRENT_VOUT (Amount: $CURRENT_AMOUNT BTC)"

    # Increment fee rate for the next transaction
    CURRENT_FEE_RATE=$((CURRENT_FEE_RATE + FEE_RATE_INCREMENT))

    # Small delay to avoid overwhelming the node or hitting rate limits
    sleep 1
done

echo "Mempool population script finished."
echo "You can check the mempool with: bitcoin-cli --testnet4 getrawmempool"
bitcoin-cli --testnet4 getrawmempool
