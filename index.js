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

const deletePageFiles = (page = 1) =>
    slack.files.list({ page, count: 5 })
        .then(response => {
            console.log('slack.files', response);
            const { paging: { pages, total }, files } = response;

            const deleteFiles = files.map(({ id }) => slack.files.delete(id));

            return Promise.all(deleteFiles)
                .then(() => {
                    if (page < pages) {
                        return deletePageFiles(page + 1);
                    }

                    return total;
                });
        });

const events = ['direct_message', 'direct_mention', 'mention'];

controller.hears('rm -rf .', events, (bot, message) => {
    const { user } = message;

    slack.users.info(user)
        .then(({ user: { is_admin } }) => {
            if (!is_admin) {
                return bot.reply(message, 'Only admin users allowed');
            }

            bot.reply(message, 'Cleaning the batcave :loading:');
            console.log('`rm -rf .`.message', message);

            deletePageFiles()
                .then(total => {
                    const reply = total ?
                        `Deleted ${total} bats :white_check_mark:` :
                        'The batcave is clean :batman:';

                    bot.reply(message, reply);
                })
                .catch(error => {
                    console.error('deletePageFiles', error);

                    bot.reply(message, 'The bats won :no_entry:');
                });
        });
});
