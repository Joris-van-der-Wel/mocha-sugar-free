'use strict';

function globalScope() {
        /* globals window, global, self */

        if (typeof window !== 'undefined') {
                // browsers
                return window;
        }

        if (typeof global !== 'undefined') {
                // node
                return global;
        }

        if (typeof self !== 'undefined') {
                // WebWorker
                return self;
        }

        throw Error('mocha-sugar-free: Unable to find the global scope');
}

module.exports = globalScope;
