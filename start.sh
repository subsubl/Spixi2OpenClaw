#!/usr/bin/env bash
export PATH=$HOME/dotnet:$PATH
DOTNET_BIN=$HOME/dotnet/dotnet

# Kill existing
pkill -9 dotnet
pkill -9 node
fuser -k 8001/tcp
fuser -k 1883/tcp
rm mqtt.pid quixi.pid bridge.pid || true

# Start MQTT Broker
node mqtt-broker.js > mqtt.log 2>&1 &
echo $! > mqtt.pid

# Wait for broker
sleep 5

# Start QuIXI
cd QuIXI
# Load password from config.json if available
WALLET_PWD=$(node -e "try { console.log(require('../config.json').walletPassword || 'Halalati1106'); } catch(e) { console.log('Halalati1106'); }")
$DOTNET_BIN run --project QuIXI -- --walletPassword "$WALLET_PWD" --clean > quixi_run.log 2>&1 &
echo $! > quixi.pid
cd ..

# Wait for QuIXI
sleep 20

# Start Bridge
node spixi-bridge.js > bridge.log 2>&1 &
echo $! > bridge.pid

echo "Station Services started."
