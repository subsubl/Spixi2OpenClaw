#!/usr/bin/env bash
# Spixi2OpenClaw Station Starter

# Configuration
WALLET_PASS="YOUR_WALLET_PASSWORD"
QUIXI_PATH="./QuIXI"

# Cleanup
echo "Cleaning up old processes..."
pkill -f "node broker.js"
pkill -f "node bridge.js"
pkill -f "dotnet run --project QuIXI"

# Start MQTT Broker
echo "Starting MQTT Broker..."
node broker.js > mqtt.log 2>&1 &
sleep 2

# Start QuIXI (via Submodule)
echo "Starting QuIXI Node..."
if [ -d "$QUIXI_PATH" ]; then
    cd "$QUIXI_PATH"
    dotnet run --project QuIXI -- --walletPassword "$WALLET_PASS" > ../quixi.log 2>&1 &
    cd ..
else
    echo "Error: QuIXI submodule not found. Run 'git submodule update --init --recursive'"
    exit 1
fi

# Wait for node to initialize
echo "Waiting for QuIXI to warm up..."
sleep 20

# Start Bridge
echo "Starting Bridge..."
node bridge.js > bridge.log 2>&1 &

echo "Station is ONLINE."
