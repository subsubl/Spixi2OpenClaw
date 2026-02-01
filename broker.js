const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const port = 1884;

server.listen(port, "0.0.0.0", function () {
  console.log('MQTT Broker started on 0.0.0.0:', port);
});

aedes.on('client', function (client) {
  console.log('CLIENT_CONNECTED:', client.id);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log(`PUB [${client.id}] -> ${packet.topic}`);
  }
});
