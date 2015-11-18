'use strict';

var sugarFree = require('..');

sugarFree.describe('mocha-sugar-free: browser skip', function() {
        sugarFree.it('Should be skipped in browsers', function() {

                if (typeof HTMLElement !== 'undefined') {
                        throw Error('Should have been skipped');
                }

        }, {skipIfBrowser: true});

        sugarFree.it('Should be skipped in web worker', function() {

                if (typeof WorkerGlobalScope !== 'undefined') {
                        throw Error('Should have been skipped');
                }

        }, {skipIfWebWorker: true});

        sugarFree.it('Should be skipped in node', function() {

                if (typeof WorkerGlobalScope === 'undefined' &&
                    typeof HTMLElement === 'undefined') {
                        throw Error('Should have been skipped');
                }

        }, {skipUnlessBrowser: true});
});
