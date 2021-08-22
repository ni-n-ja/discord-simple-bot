let https = require('https');
const token = process.env.token;
const application_id = process.env.application_id;
const guild_id = process.env.application_id;
const endpoint = `/applications/${application_id}/guilds/${guild_id}/commands`

commands = [
    {
        "name": "command",
        "description": "Command Description",
        "options": [
            {
                "type": 6,
                "name": "user",
                "description": "option",
                "required": False
            }
        ]
    }
]

const req = https.request({
    protocol: 'https:',
    host: 'discord.com',
    path: endpoint,
    headers: {
        'Authorization': 'Bot ' + token,
        'Content-Type': 'application/json',
    },
    method: 'POST',
}, (res) => {
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
        resolve();
    });
});

req.on('error', (err) => {
    console.error(err);
});

req.write(JSON.stringify(
    {
        content: "TEST"
    }
));
req.end();