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

controller.hears('rm -rf .', 'direct_message', (bot, message) => {
    const { user } = message;

    slack.users.info(user)
        .then(({ user: { is_admin } }) => {
            if (!is_admin) {
                return bot.reply(message, 'Only admin users allowed');
            }

            bot.reply(message, 'Deleting files :loading:');
            console.log('`rm -rf .`.message', message);

            deletePageFiles()
                .then(total => bot.reply(message, `Deleted ${total} files`))
                .catch(error => {
                    console.error('deletePageFiles', error);

                    bot.reply(message, 'Error deleting files');
                });
        });
});
