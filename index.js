// Botkit bot
const Botkit = require('botkit');
const controller = Botkit.slackbot();
const bot = controller.spawn({
    token: process.env.SLACK_BOT_TOKEN
});

// Slack web client
const { WebClient } = require('@slack/client');
const slack = new WebClient(process.env.SLACK_TOKEN);

bot.startRTM((err, bot, payload) => {
    if (err) {
        throw new Error('Could not connect to Slack');
    }

    console.log('startRTM', payload);
});

controller.hears('hello','direct_message', (bot, message) => {
    bot.reply(message, 'Processing');
    slack.files.list()
        .then(response => bot.reply(message, JSON.stringify(response)))
        .catch(error => bot.reply(message, JSON.stringify(error)));
});
