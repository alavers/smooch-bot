'use strict';

class Bot {
    constructor(options) {
        options = options || {};
        if (!options.store || !options.lock || !options.userId) {
            throw new Error('Invalid arguments. store, lock and userId are required');
        }

        this.store = options.store;
        this.lock = options.lock;
        this.userId = options.userId;
    }

    say(text) {
        return new Promise((resolve) => {
            // Do nothing
            resolve();
        });
    }

    getProp(key) {
        return this.store.get(this.userId, key);
    }

    setProp(key, value) {
        return this.store.set(this.userId, key, value);
    }

    getState() {
        return this.store.getState(this.userId);
    }

    setState(state) {
        return this.store.setState(this.userId, state);
    }

    acquireLock() {
        return this.lock.acquireLock(this.userId);
    }

    releaseLock() {
        return this.lock.releaseLock(this.userId);
    }
}

module.exports = Bot;
