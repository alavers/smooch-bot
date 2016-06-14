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
        const step = this.step(state);

        Promise.resolve(step.receive(this.bot, message))
            .then((returnedState) => {
                nextState = this.validateState(returnedState);
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
        state = this.validateState(state);
        return this.script.steps[state];
    }

    validateState(state) {
        const step = this.script.steps[state];
        if (!step) {
            console.error(`Undefined state ${state} for user ${this.bot.userId},`
                    + `reverting to default state '${this.initialState}'`);
            return this.initialState;
        }

        if (!step.receive || typeof step.receive !== 'function') {
            console.error(`Invalid state ${state} for user ${this.bot.userId}`
                    + `has no receive method, reverting to default state '${this.initialState}'`);
            return this.initialState;
        }
        return state;
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
