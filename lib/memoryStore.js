'use strict';

class MemoryStore {
    constructor() {
        this.users = {};
    }

    get(userId, key) {
        return new Promise((resolve) => {
            const user = this.users[userId];
            resolve(user && user[key]);
        });
    }

    set(userId, key, value) {
        return new Promise((resolve) => {
            const user = this.users[userId];
            if (!user) {
                this.users[userId] = {
                    [key]: value
                };
            } else {
                this.users[userId][key] = value;
            }
            resolve();
        });
    }

    getState(userId) {
        return this.get(userId, 'state');
    }

    setState(userId, state) {
        return this.set(userId, 'state', state);
    }
}

module.exports = MemoryStore;
