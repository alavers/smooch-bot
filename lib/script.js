'use strict';

const defaultSteps = {
    processing: {
        receive: () => 'processing'
    },

    start: {
        receive: () => 'finish'
    },

    finish: {
        receive: () => 'finish'
    },

    error: {
        prompt: (bot) => bot.say('Beep Boop.. Sorry, I\'m having some trouble...'),
        receive: () => 'start'
    }
};

class Script {
    constructor(steps) {
        this.steps = Object.assign({}, defaultSteps, steps);
    }
}

module.exports = Script;
