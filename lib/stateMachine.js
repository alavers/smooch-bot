'use strict';

const MemoryStore = require('./memoryStore');

class StateMachine {
    constructor(options) {
        this.options = options || {};
        if (!this.options.script) {
            throw new Error('Missing required option script');
        }

        if (!this.options.bot) {
            throw new Error('Missing required option bot');
        }

        this.script = options.script;
        this.bot = options.bot;
        this.initialState = this.options.initialState || 'start';
        this.userId = options.userId;
    }

    receiveMessage(message) {
        return this.getState()
            .then((state) => {
                if (state === 'processing') {
                    return this.prompt(state);
                }
                return this.transition(message, state);
            });
    }

    transition(message, state) {
        let nextState;

        return this.setState('processing')
            .then(() => {
                return this.step(state).receive(this.bot, message);
            })
            .then((returnedState) => {
                nextState = returnedState;
                return this.setState(nextState);
            })
            .then(() => {
                return this.prompt(nextState);
            })
            .catch((err) => {
                // In case of error, prevent ourselves from getting stuck in processing
                return this.setState(state)
                    .then(function() {
                        throw err;
                    });
            });
    }

    _doPrompt(state) {
        const step = this.step(state);
        return step.prompt ?
            step.prompt(this.bot) :
            Promise.resolve();
    }

    prompt(state) {
        if (state) {
            return this._doPrompt(state);
        } else {
            return this.getState().then((s) => this._doPrompt(s));
        }
    }

    step(state) {
        if (!this.script.steps[state]) {
            throw new Error(`State '${state}' was not found in the script`);
        }
        return this.script.steps[state];
    }

    getState() {
        return this.bot.store.getState(this.userId)
            .then((state) => state || this.initialState);
    }

    setState(state) {
        return this.bot.store.setState(this.userId, state);
    }
}

module.exports = StateMachine;
