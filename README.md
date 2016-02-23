# Smooch Bot

Build your own chat bot on top of smooch.io

1. Build your bot's chat script, eg:

```
const script = new Script({
    askName: {
        prompt: (bot) => bot.say('What\'s your name'),
        receive: (bot, message) => {
            const name = message.text.trim();
            bot.setProp('name', name);
            return bot.say(`I'll call you ${name}! Great!`)
                .then(() => 'finish');
        }
    }
});
```

2. Sign up for a free account at [smooch.io](http://app.smooch.io/signup) hook two channels together (eg hook up SMS to Slack)

3. Create a Smooch API Key and generate a JWT

4. Create a Smooch webhook

5. Deploy to Heroku