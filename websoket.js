const token = process.env.TOKEN;
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

const EventEmitter = require('events').EventEmitter;
const eventEmitter = new EventEmitter;

eventEmitter.on('disconnect', () => {
    connect();
});

let sequence = 0;
let session_id = 0;

const connect = () => {
    const WebSocketClient = require('websocket').client;
    const client = new WebSocketClient();

    client.on('connectFailed', (error) => {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', (connection) => {

        connection.on('error', (error) => {
            console.log("Connection Error: " + error.toString());
        });

        connection.on('close', () => {
            console.log('Connection Closed');
            client.abort();
            eventEmitter.emit('disconnect');
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
                    if (data.d && data.d.session_id) {
                        session_id = data.d.session_id;
                    }
                    // console.log(JSON.stringify(data));
                } else if (data.op == 7 || data.op == 6) {
                    console.log("////RECONNECT////");
                    connection.sendUTF(JSON.stringify(
                        {
                            "op": 6,
                            "d": {
                                "token": token,
                                "session_id": session_id,
                                "seq": sequence
                            }
                        }
                    ));
                } else {
                    console.log("////XXXX////");
                    console.log(JSON.stringify(data));
                }

            }
        });
    });

    client.connect('wss://gateway.discord.gg/?v=6&encoding=json');
}

connect();