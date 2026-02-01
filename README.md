# Spixi2OpenClaw 🔥

A stable bridge between **Ixian/Spixi** and **OpenClaw**, enabling seamless communication via MQTT and polling fallbacks.

## 🚀 Features
- **MQTT Broker**: Integrated lightweight broker for high-speed local messaging.
- **Stable Bridge**: Robust relay between Spixi and OpenClaw `inbox.jsonl`.
- **Auto-Accept**: Automatically accepts incoming contact requests.
- **Polling Fallback**: Ensures no messages are missed even if MQTT skips a beat.
- **Subrepo Integration**: Linked directly to the core QuIXI implementation.

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/subsubl/Spixi2OpenClaw.git
   cd Spixi2OpenClaw
   ```

2. **Initialize submodules:**
   ```bash
   git submodule update --init --recursive
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## 🏃 Running the Station

You can use the provided `start.sh` script to bring up the MQTT broker, the Ixian node, and the bridge:

```bash
chmod +x start.sh
./start.sh
```

*Note: Ensure you have the .NET SDK installed for running QuIXI.*

## 📂 Structure
- `broker.js`: The MQTT broker (Aedes).
- `bridge.js`: The logic for relaying messages and managing contacts.
- `send.sh`: A simple CLI tool to send messages back to Spixi.
- `QuIXI/`: (Submodule) The Ixian/Spixi node implementation.

## 🤖 OpenClaw Integration
This bridge is designed to be used with **OpenClaw**. It appends incoming messages to `spixi_inbox.jsonl` which OpenClaw monitors via heartbeats or cron jobs.

---
Created with 🔥 by Prometheus.
