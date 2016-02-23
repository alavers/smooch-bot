'use strict';

const smoochBot = require('smooch-bot');
const StateMachine = smoochBot.StateMachine;
const MemoryStore = smoochBot.MemoryStore;
const BotCore = smoochBot.BotCore;
const Script = smoochBot.Script;

class ConsoleBot extends BotCore {
    say(text) {
        return new Promise((resolve) => {
            console.log(text);
            resolve();
        });
    }
}

const script = new Script({
    start: {
        receive: (bot) => {
            return bot.say('Hi! I\'m Smooch Bot!')
                .then(() => 'askName');
        }
    },

    askName: {
        prompt: (bot) => bot.say('What\'s your name'),
        receive: (bot, message) => {
            const name = message.text.trim();
            bot.setProp('name', name);
            return bot.say(`I'll call you ${name}! Great!`)
                .then(() => 'finish');
        }
    },

    finish: {
        receive: (bot) => {
            return bot.getProp('name')
                .then((name) => bot.say(`Sorry ${name}, my creator didn't ` +
                        'teach me how to do anything else!'))
                .then(() => 'finish');
        }
    }
});

const userId = 'testUserId';
const store = new MemoryStore();
const bot = new ConsoleBot(store, userId);

const stateMachine = new StateMachine({
    script,
    bot,
    userId
});

process.stdin.on('data', function(data) {
    stateMachine.receiveMessage({
        text: data.toString()
    })
        .catch((err) => {
            console.error(err);
            console.error(err.stack);
        });
});
