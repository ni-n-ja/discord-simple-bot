let https = require('https');
const token = process.env.token;

const get = (options) => {
    return new Promise((resolve, reject) => {

        const req = https.request(options, (res) => {
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                resolve();
            });
        });

        req.on('error', (err) => {
            console.error(err);
            reject(err);
        });

        req.end();
    });
};

const post = (options) => {
    return new Promise((resolve, reject) => {

        const req = https.request(options, (res) => {
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                resolve();
            });
        });

        req.on('error', (err) => {
            console.error(err);
            reject(err);
        });

        req.write(JSON.stringify(
            {
                content: "TEST"
            }
        ));
        req.end();
    });
};

get({
    protocol: 'https:',
    host: 'discord.com',
    path: `/api/v6/users/${process.env.userId}`,
    headers: {
        'Authorization': 'Bot ' + token
    },
    method: 'GET',
});

post({
    protocol: 'https:',
    host: 'discord.com',
    path: `/api/v6/channels/${process.env.channelId}/messages`,
    headers: {
        'Authorization': 'Bot ' + token,
        'Content-Type': 'application/json',
    },
    method: 'POST',
});