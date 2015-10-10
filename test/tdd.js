'use strict';

var assert = require('assert');
var sugarFree = require('..');

sugarFree.suite('mocha-sugar-free: tdd', function() {
        sugarFree.test('Should only export tdd methods', function() {
                assert.deepEqual(
                        Object.keys(sugarFree).sort(),
                        [ 'detectedInterface', 'run', 'setup', 'suite', 'suiteSetup',
                          'suiteTeardown', 'teardown', 'test']
                );
        });

        sugarFree.test('Pass', function() {

        });

        sugarFree.test('Pass', function(context) {
                setTimeout(function(){
                        context.done();
                }, 10);
        }, {async: true});

        sugarFree.test.skip('Pending ( test.skip )', function() {
                throw Error('Should have been skipped');
        });

        sugarFree.test('Pending ( test with skip:true )', function() {
                throw Error('Should have been skipped');
        }, {skip: true});

        sugarFree.suite('Hooks', function() {
                var progression = 0;

                sugarFree.test('First', function() {
                        assert.equal(progression, 10);
                        ++progression;
                });

                sugarFree.test('Second', function() {
                        assert.equal(progression, 121);
                        ++progression;
                });



                sugarFree.suiteSetup(function() {
                        assert.equal(progression, 0);
                });

                sugarFree.suiteSetup(function(context) {
                        assert.equal(progression, 0);
                        context.done();
                }, {async: true});

                sugarFree.suiteSetup({
                        fn  : function() {
                                throw Error('Should have been skipped');
                        },
                        skip: true
                });


                sugarFree.setup(function() {
                        progression += 5;
                });

                sugarFree.setup(function(context) {
                        progression += 5;
                        context.done();
                }, {async: true});

                sugarFree.setup({
                        fn  : function() {
                                throw Error('Should have been skipped');
                        },
                        skip: true
                });


                sugarFree.teardown(function() {
                        progression += 50;
                });

                sugarFree.teardown(function(context) {
                        progression += 50;
                        context.done();
                }, {async: true});

                sugarFree.teardown({
                        fn  : function() {
                                throw Error('Should have been skipped');
                        },
                        skip: true
                });


                sugarFree.suiteTeardown(function() {
                        assert.equal(progression, 222);
                });

                sugarFree.suiteTeardown(function(context) {
                        assert.equal(progression, 222);
                        context.done();
                }, {async: true});

                sugarFree.suiteTeardown({
                        fn  : function() {
                                throw Error('Should have been skipped');
                        },
                        skip: true
                });
        });

        sugarFree.suite.skip('Pending suite (suite.skip)', function(){
                sugarFree.test('Pending', function() {
                        throw Error('Should have been skipped');
                });
        });

        sugarFree.suite('Pending Suite: skip=true', function() {
                sugarFree.test('Pending', function() {
                        throw Error('Should have been skipped');
                });
        }, {skip: true});
});
