# botman
Slack bot.

## Deployment to [now](now.sh)

Install `now` globally.

* `now login`: only the first time.
* `now switch`: select the appropiate team.

And deploy with `npm run deploy` or manually:

1) `now rm -y botman`: to remove last instance.
2) `now`: to deploy new instance.
3) `now alias`: to alias the instance.

> Set `@botman-slack-token` and `@botman-slack-bot-token` secrets in `now` if not configured already in the team.

## Slack Permissions

* `bot`
* `commands`
* `files:read`
* `files:write:user`
* `users:read`

## Tools

* [Slack Node SDK](https://github.com/slackapi/node-slack-sdk)
* [BotKit](https://github.com/howdyai/botkit/blob/master/docs/readme-slack.md)
