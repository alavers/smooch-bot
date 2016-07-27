'use strict';

const SmoochCore = require('smooch-core');

let hackLock = {};

class SmoochApiStore {
    constructor(options) {
        options = options || {};
        if (!options.jwt) {
            throw new Error('Invalid options. jwt is required');
        }

        this.api = new SmoochCore({
            jwt: options.jwt
        });
        this.appUserResolved = false;
    }

    _getOrCreate(userId) {
        return this.api.appUsers.get(userId)
            .catch((err) => {
                if (err.response.status === 404) {
                    return this.api.appUsers.create(userId);
                } else {
                    throw err;
                }
            })
            .then((res) => {
                this.appUserResolved = true;
                return res.appUser;
            });
    }

    get(userId, key) {
        return this._getOrCreate(userId)
            .then((appUser) => {
                return appUser.properties[key];
            });
    }

    set(userId, key, value) {
        let promise;
        if (!this.appUserResolved) {
            promise = this._getOrCreate(userId);
        } else {
            promise = Promise.resolve();
        }

        return promise.then(() => {
            return this.api.appUsers.update(userId, {
                properties: {
                    [key]: value
                }
            });
        });
    }

    getState(userId) {
        return this.get(userId, 'state');
    }

    setState(userId, state) {
        return this.set(userId, 'state', state);
    }

    getApi() {
        return this.api;
    }
}

module.exports = SmoochApiStore;
