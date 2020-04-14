import WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', function connection(ws, req) {
  console.log("req.url", req.url)
});


wss.on('close', function close() {
  console.log('disconnected');
});

const sendMessage = (data: any) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

export {
  sendMessage
}