'use strict';

class BotCore {
    constructor(store, userId) {
        this.store = store;
        this.userId = userId;
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
}

module.exports = BotCore;
