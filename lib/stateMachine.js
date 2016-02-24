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
    }

    receiveMessage(message) {
        if (message.text === 'reset') {
            return Promise.all([
                this.bot.releaseLock(),
                this.setState('start')
            ]);
        }

        return Promise.all([
            this.getState(),
            this.bot.acquireLock()
        ])
            .then((results) => {
                const state = results[0];
                const lock = results[1];

                if (!lock) {
                    return this.prompt('processing');
                }

                return this.transition(message, state);
            })
            .then(() => this.bot.releaseLock())
            .catch((err) => {
                this.bot.releaseLock();
                this.prompt('error');
                throw err;
            });
    }

    transition(message, state) {
        let nextState;

        return this.step(state).receive(this.bot, message)
            .then((returnedState) => {
                nextState = returnedState;
                return this.setState(nextState);
            })
            .then(() => {
                return this.prompt(nextState);
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
        return this.bot.getState()
            .then((state) => state || this.initialState);
    }

    setState(state) {
        return this.bot.setState(state);
    }
}

module.exports = StateMachine;
