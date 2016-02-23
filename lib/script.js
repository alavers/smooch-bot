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
    }
};

class Script {
    constructor(steps) {
        this.steps = Object.assign({}, defaultSteps, steps);
    }
}

module.exports = Script;
