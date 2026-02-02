const mqtt = require('mqtt');
const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');

// Load config
let config = {
    mqttHost: '127.0.0.1',
    mqttPort: 1884,
    quixiApiUrl: 'http://localhost:8001',
    myWalletAddress: '',
    openclawRecipient: ''
};

if (fs.existsSync('config.json')) {
    try {
        const fileConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
        config = { ...config, ...fileConfig };
    } catch (e) {
        console.error('[BRIDGE] Error parsing config.json:', e.message);
    }
}

const MQTT_HOST = config.mqttHost;
const MQTT_PORT = config.mqttPort;
const QUIXI_API_URL = config.quixiApiUrl;

const processedIds = new Set();

console.log(`[BRIDGE] Starting Stable Bridge v3...`);

// 1. MQTT Listener
const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`);
client.on('connect', () => {
    console.log('[BRIDGE] MQTT Connected');
    client.subscribe('#'); 
});

client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        if (topic === 'Chat') handleIncoming(data, 'MQTT');
        if (topic === 'RequestAdd2') handleContactRequest(data);
    } catch(e) {}
});

// 2. Polling Fallback
async function pollSpixi() {
    try {
        // Get contacts
        const contacts = await apiGet('/contacts');
        if (!contacts || !contacts.result) return;

        for (const friend of contacts.result) {
            if (friend.metaData.unreadMessageCount > 0) {
                const messages = await apiGet(`/getLastMessages?address=${encodeURIComponent(friend.walletAddress.base58Address)}&count=50`);
                if (messages && messages.result) {
                    messages.result.forEach(m => {
                        if (m.localSender || m.read) return;
                        handleIncoming({ sender: friend.walletAddress.base58Address, data: { data: m.message }, id: m.id }, 'POLL');
                    });
                    // Mark as read
                    await apiGet(`/markMessagesRead?address=${encodeURIComponent(friend.walletAddress.base58Address)}`);
                }
            }
        }
    } catch (e) {
        console.error('[BRIDGE] Polling error:', e.message);
    }
}

function triggerOpenClaw() {
    if (!config.openclawRecipient) return;
    // Trigger an agent turn to process the inbox
    // Using --thinking off to save tokens/time for the wakeup
    exec(`openclaw agent --to ${config.openclawRecipient} --message "SPIXI_SIGNAL" --thinking off`, (error, stdout, stderr) => {
        if (error) {
            console.error(`[BRIDGE] OpenClaw trigger error: ${error.message}`);
            return;
        }
        console.log('[BRIDGE] OpenClaw triggered');
    });
}

function handleIncoming(data, source) {
    const id = data.id || (data.data && data.data.id);
    if (id && processedIds.has(id)) return;
    if (id) processedIds.add(id);

    const sender = data.sender;
    const text = data.data ? data.data.data : data.message;
    
    if (!text) return;
    if (config.myWalletAddress && sender === config.myWalletAddress) return;

    console.log(`[BRIDGE] [${source}] Message from ${sender}: ${text}`);
    
    const logEntry = JSON.stringify({
        channel: 'spixi',
        from: sender,
        message: text,
        timestamp: Date.now(),
        source: source
    });
    
    fs.appendFileSync('spixi_inbox.jsonl', logEntry + '\n');
    
    // Trigger OpenClaw
    triggerOpenClaw();
}

function handleContactRequest(data) {
    const sender = data.sender;
    console.log(`[BRIDGE] Auto-accepting: ${sender}`);
    apiGet(`/acceptContact?address=${encodeURIComponent(sender)}`);
}

function apiGet(path) {
    return new Promise((resolve, reject) => {
        http.get(QUIXI_API_URL + path, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch(e) { resolve(null); }
            });
        }).on('error', reject);
    });
}

setInterval(pollSpixi, 5000);
console.log('[BRIDGE] Polling active (5s)');
