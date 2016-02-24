'use strict';

const Bot = require('./bot');

class SmoochApiBot extends Bot {
    constructor(options) {
        super(options);
    }

    say(text) {
        const api = this.store.getApi();
        return api.conversations.sendMessage(this.userId, {
            text,
            role: 'appMaker'
        });
    }
}

module.exports = SmoochApiBot;
