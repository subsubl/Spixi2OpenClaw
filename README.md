# Spixi2OpenClaw 🔥

A stable bridge between **Ixian/Spixi** and **OpenClaw**, enabling seamless communication via MQTT and polling fallbacks.

## 🌐 What is Spixi?

**Spixi** is a next-generation decentralized messenger built on the **Ixian DLT (Distributed Ledger Technology)**. Unlike traditional messaging apps that rely on centralized servers or "distributed" but siloed clusters, Spixi operates as a truly peer-to-peer network where your data and identity are yours alone.

### 💎 Why Spixi over WhatsApp, Telegram, or Signal?

While traditional apps offer encryption, Spixi goes several steps further by decentralizing the infrastructure itself:

| Feature | Spixi | WhatsApp / Signal | Telegram |
| :--- | :--- | :--- | :--- |
| **Central Server** | **None (P2P)** | Yes | Yes |
| **Metadata Privacy** | **Absolute** | Server sees metadata | Server sees metadata |
| **Account Identity** | **Wallet Address** | Phone Number | Phone Number |
| **Censorship Proof** | **Native** | Can be blocked by IP | Can be blocked by IP |
| **Data Ownership** | **On-Device** | Cloud/Server Backup | Cloud Backup |
| **Earning / Payments**| **Integrated (IXI)** | No | No |

### 🚀 Key Benefits

1.  **No Phone Number Required:** Your identity is a cryptographic wallet address. No SIM card, no personal data linkage.
2.  **True P2P Connectivity:** Messages travel directly between users or through decentralized Ixian S2 (Streaming) nodes, making it nearly impossible to shut down or censor.
3.  **Low Latency MQTT Integration:** This bridge leverages Ixian's architecture to provide high-speed, real-time message delivery through local MQTT hooks.
4.  **Zero Trust Architecture:** You don't have to trust a corporation like Meta or even a non-profit like Signal. You only trust the cryptography and the open-source code.

---

## 🚀 Features
- **MQTT Broker**: Integrated lightweight broker for high-speed local messaging.
- **Stable Bridge**: Robust relay between Spixi and OpenClaw `inbox.jsonl`.
- **Auto-Accept**: Automatically accepts incoming contact requests.
- **Polling Fallback**: Ensures no messages are missed even if MQTT skips a beat.
- **Real-Time Wakeup**: Triggers OpenClaw agent turns instantly upon message arrival.

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
This bridge is designed to be used with **OpenClaw**. It appends incoming messages to `spixi_inbox.jsonl` which OpenClaw monitors, and triggers a wakeup signal for immediate AI responses.

---
