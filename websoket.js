const token = process.env.token;
const identity = {
    "op": 2,
    "d": {
        "token": token,
        "properties": {
            "$os": "linux",
            "$browser": "my_library",
            "$device": "my_library"
        }
    }
};

let WebSocketClient = require('websocket').client;
let client = new WebSocketClient();

let sequence = 0;

client.on('connectFailed', (error) => {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', (connection) => {

    connection.on('error', (error) => {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', () => {
        console.log('echo-protocol Connection Closed');
    });

    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            const data = JSON.parse(message.utf8Data);

            if (data.s) {
                sequence = data.s;
            }

            if (data.op && data.op == 10) {
                console.log("////Hello////");

                setInterval(() => {
                    connection.sendUTF(JSON.stringify(
                        {
                            "op": 1,
                            "d": sequence
                        }
                    ));
                }, (data.d.heartbeat_interval));

                connection.sendUTF(JSON.stringify(identity), (err) => {
                    err ? console.log(err) : null;
                });

            } else if (data.op == 11) {
                console.log("////Hello ACK////");
            } else if (data.op == 0) {
                console.log("////EVENT////");
                // console.log(JSON.stringify(data));
            } else {
                console.log("////XXXX////");
            }

        }
    });
});

client.connect('wss://gateway.discord.gg/?v=6&encoding=json');