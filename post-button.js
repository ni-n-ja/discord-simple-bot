let https = require('https');
const token = process.env.token;
const channel_id = process.env.channel_id;

const req = https.request({
    protocol: 'https:',
    host: 'discord.com',
    path: `/api/v8/channels/${channel_id}/messages`,
    headers: {
        'Authorization': 'Bot ' + token,
        'Content-Type': 'application/json',
    },
    method: 'POST',
}, (res) => {
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (err) => {
    console.error(err);
});

req.write(JSON.stringify({
    "content": "Hello World",
    "components": [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "1",
                    "style": 1,
                    "custom_id": "click_one",
                },
                {
                    "type": 2,
                    "label": "2",
                    "style": 2,
                    "custom_id": "click_two",
                },
                {
                    "type": 2,
                    "label": "3",
                    "style": 3,
                    "custom_id": "click_three",
                },
                {
                    "type": 2,
                    "label": "4",
                    "style": 4,
                    "custom_id": "click_four",
                },
            ]
        }
    ]
}));
req.end();