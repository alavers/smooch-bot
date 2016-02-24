'use strict';

class MemoryLock {
    constructor() {
        this.locks = {};
    }

    acquireLock(userId) {
        if (this.locks[userId]) {
            return false;
        }
        this.locks[userId] = true;
        return Promise.resolve(true);
    }

    releaseLock(userId) {
        this.locks[userId] = false;
        return Promise.resolve();
    }
}

module.exports = MemoryLock;
