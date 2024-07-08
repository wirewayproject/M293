// Deployment

// Setup instructions
//             @inject                 aaaaaaaa       server.js            3000
// (tell the hosting to inject here) (hosting id)  (file to serve) (force port - optional)
//    @config           5            1000          aaaaaaaa,bbbbbbb,ccccccc          true|false          1                  5
// (call config) (service type) (rate limit) (server messaging ids - experimantal) (auto-resize) (resize range min) (resize range max)

// @inject 64b3f36 . 3000
// @config 0 1000 null false 1 1

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 4823;
require('dotenv').config();
root = process.cwd()+"/web";
const compileSass = require('express-compile-sass');


const webhookUrl = process.env.WEBHOOK_URL;
console.log(root)
app.use(express.json());

app.use(compileSass({
    root: root,
    sourceMap: true,
    sourceComments: true,
    watchFiles: true,
    logToConsole: false
}));

app.use(express.static('web'));

const fs = require('fs');
const path = require('path');

app.use('/submitFeedback', async (req, res) => {
    try {
        const feedback = {
            name: req.body.name,
            email: req.body.email,
            content: req.body.content
        };

        const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: `**Feedback Submitted**\n\nName: ${feedback.name}\nEmail: ${feedback.email}\n\n${feedback.content}`
            })
        });

        if (webhookResponse.ok) {
            res.status(200).json({ message: 'Feedback submitted successfully' });
        } else {
            res.status(500).json({ message: 'Failed to submit feedback' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});