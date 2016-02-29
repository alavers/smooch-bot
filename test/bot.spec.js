'use strict';

const assert = require('assert');
const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const hat = require('hat');
const Bot = require('../lib/bot');
const MemoryStore = require('../lib/memoryStore');
const MemoryLock = require('../lib/memoryLock');

describe('bot', function() {
    let bot;
    let store;
    let lock;
    let userId;

    beforeEach(function() {
        store = new MemoryStore();
        lock = new MemoryLock();
        userId = hat();
    });

    describe('constructor', function() {
        it('should create a bot', function() {
            bot = new Bot({
                store,
                lock,
                userId
            });

            bot.store.should.equal(store);
            bot.lock.should.equal(lock);
            bot.userId.should.equal(userId);
        });

        for (let omit of ['store', 'lock', 'userId']) {
            it(`should fail if missing prop ${omit}`, function() {
                let options = {
                    store,
                    lock,
                    userId
                };
                delete options[omit];
                expect(() => new Bot(options)).to.throw;
            });
        }
    });

    describe('method', function() {
        beforeEach(function() {
            bot = new Bot({
                store,
                lock,
                userId
            });
        });

        it('#say', function() {
            return bot.say().should.be.fulfilled;
        });

        it('#getProp', function() {
            return bot.getProp('foo').should.eventually.be.undefined;
        });

        it('#setProp', function() {
            let value = hat();
            return bot.setProp('foo', value)
                .then(() => bot.getProp('foo'))
                .should.eventually.equal(value);
        });

        it('#getState', function() {
            return bot.getState('bar').should.eventually.be.undefined;
        });

        it('#setState', function() {
            let value = hat();
            return bot.setProp('bar', value)
                .then(() => bot.getProp('bar'))
                .should.eventually.equal(value);
        });

        it('#acquireLock', function() {
            return bot.acquireLock().should.eventually.be.true;
        });

        it('#acquireLock already acquired', function() {
            return bot.acquireLock()
                .then(() => bot.acquireLock())
                .should.eventually.be.false;
        });

        it('#releaseLock', function() {
            return bot.acquireLock()
                .then(() => bot.releaseLock())
                .then(() => bot.acquireLock())
                .should.eventually.be.true;
        });
    });
});
