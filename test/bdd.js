'use strict';

var assert = require('assert');
var sugarFree = require('..');
var Promise = require('bluebird');

var counter = 0;

sugarFree.describe('mocha-sugar-free: bdd', function() {

        sugarFree.it('Should only export bdd methods', function() {
                assert.deepEqual(
                        Object.keys(sugarFree).sort(),
                        [ 'after', 'afterEach', 'before', 'beforeEach',
                          'context', 'describe', 'detectedInterface',
                          'it', 'run', 'specify', 'xcontext', 'xdescribe',
                          'xit', 'xspecify' ]
                );
        });

        sugarFree.it('Pass', function() {
                ++counter;
        });

        sugarFree.specify('Pass ( specify )', function() {
                ++counter;
        });

        sugarFree.it('Pass: async', function(context) {
                setTimeout(function(){
                        ++counter;
                        context.done();
                }, 10);
        }, {async: true});

        sugarFree.it('Pass: return promise', function() {
                return Promise.delay(10).then(function() {
                        ++counter;
                });
        });

        sugarFree.it('Pass: return promise and expectPromise', function() {
                return Promise.delay(10).then(function() {
                        ++counter;
                });
        }, {expectPromise: true});

        sugarFree.it('Fail: do not return promise and expectPromise', function fooBar() {
                ++counter;
        }, {expectPromise: true});

        sugarFree.it('Fail: Time out after 25ms', function() {
                ++counter;
        }, {async: true, timeout: 25});

        sugarFree.it('Fail: Time out after 26ms', function(context) {
                context.timeout(26);
                ++counter;
        }, {async: true});

        sugarFree.it('Pass: enableTimeouts:false', function(context) {

                setTimeout(function() {
                        ++counter;
                        context.done();
                }, 10);
        }, {async: true, timeout: 1, enableTimeouts: false});

        sugarFree.it('Pass: .enableTimeouts(false)', function(context) {
                context.timeout(1);
                context.enableTimeouts(false);

                setTimeout(function() {
                        ++counter;
                        context.done();
                }, 10);
        }, {async: true});

        sugarFree.xit('Pending ( xit )', function() {
                throw Error('Should have been skipped');
        });

        sugarFree.xspecify('Pending ( xspecify )', function() {
                throw Error('Should have been skipped');
        });

        sugarFree.xit('Pending ( xit async )', function() {
                throw Error('Should have been skipped');
        }, {async: true});

        sugarFree.it.skip('Pending ( it.skip )', function() {
                throw Error('Should have been skipped');
        });

        sugarFree.it('Pending ( it with skip:true )', function() {
                throw Error('Should have been skipped');
        }, {skip: true});

        sugarFree.it('Pending ( it async with skip:true)', function() {
                throw Error('Should have been skipped');
        }, {async: true, skip: true});

        sugarFree.it('Pending ( this.skip() )', function(context) {
                context.skip();
        });

        sugarFree.it('Pending ( this.skip() async)', function(context) {
                context.skip();
        }, {async: true});

        sugarFree.it('Pass with slow: 1ms', function(context) {
                setTimeout(function() {
                        ++counter;
                        context.done();
                }, 10);
        }, {slow: 1, async: true});

        sugarFree.it('Pass with .slow(2ms)', function(context) {
                context.slow(2);

                setTimeout(function() {
                        ++counter;
                        context.done();
                }, 10);
        }, {async: true});


        sugarFree.describe('Hooks', function() {
                var progression = 0;

                sugarFree.it('First', function() {
                        assert.equal(progression, 10);
                        ++progression;
                });

                sugarFree.it('Second', function() {
                        assert.equal(progression, 121);
                        ++progression;
                });



                sugarFree.before(function() {
                        assert.equal(progression, 0);
                });

                sugarFree.before(function(context) {
                        assert.equal(progression, 0);
                        context.done();
                }, {async: true});

                sugarFree.before({
                        fn  : function() {
                                throw Error('Should have been skipped');
                        },
                        skip: true
                });


                sugarFree.beforeEach(function() {
                        progression += 5;
                });

                sugarFree.beforeEach(function(context) {
                        progression += 5;
                        context.done();
                }, {async: true});

                sugarFree.beforeEach({
                        fn  : function() {
                                throw Error('Should have been skipped');
                        },
                        skip: true
                });


                sugarFree.afterEach(function() {
                        progression += 50;
                });

                sugarFree.afterEach(function(context) {
                        progression += 50;
                        context.done();
                }, {async: true});

                sugarFree.afterEach({
                        fn  : function() {
                                throw Error('Should have been skipped');
                        },
                        skip: true
                });


                sugarFree.after(function() {
                        assert.equal(progression, 222);
                        ++counter;
                });

                sugarFree.after(function(context) {
                        assert.equal(progression, 222);
                        ++counter;
                        context.done();
                }, {async: true});

                sugarFree.after({
                        fn  : function() {
                                throw Error('Should have been skipped');
                        },
                        skip: true
                });
        });

        sugarFree.describe('Hooks: Promise', function() {
                var progression = 0;

                sugarFree.it('First', function() {
                        assert.equal(progression, 2);
                        ++progression;
                });

                sugarFree.before(function() {
                        return Promise.delay(10).then(function() {
                                ++progression;
                        });
                }, {expectPromise: true});

                sugarFree.beforeEach(function() {
                        return Promise.delay(10).then(function() {
                                ++progression;
                        });
                }, {expectPromise: true});

                sugarFree.afterEach(function() {
                        return Promise.delay(10).then(function() {
                                ++progression;
                        });
                }, {expectPromise: true});

                sugarFree.after(function() {
                        return Promise.delay(10).then(function() {
                                ++progression;
                        });
                }, {expectPromise: true});

                sugarFree.after(function() {
                        assert.equal(progression, 5);
                });
        });

        sugarFree.describe('arguments handling', function() {
                sugarFree.it({
                        title: 'Pass 1',
                        async: true,
                        fn   : function(context) {
                                ++counter;
                                context.done();
                        }
                });

                sugarFree.it('Pass 2', {
                        async: true,
                        fn   : function(context) {
                                ++counter;
                                context.done();
                        }
                });

                sugarFree.it(
                        'Pass 3',
                        function(context) {
                                ++counter;
                                context.done();
                        },
                        {async: true}
                );

                sugarFree.it(
                        'Pass 4',
                        {async: true},
                        function(context) {
                                ++counter;
                                context.done();
                        }
                );

                sugarFree.it(
                        {async: true},
                        'Pass 5',
                        function(context) {
                                ++counter;
                                context.done();
                        }
                );
        });

        sugarFree.xdescribe('Pending Suite: xdescribe', function() {
                sugarFree.it('Pending', function() {
                        throw Error('Should have been skipped');
                });
        });

        sugarFree.xcontext('Pending Suite: xcontext', function() {
                sugarFree.it('Pending', function() {
                        throw Error('Should have been skipped');
                });
        });

        sugarFree.xdescribe({
                title: 'Pending suite (xdescribe with options)',
                fn   : function() {
                        sugarFree.it('Pending', function() {
                                throw Error('Should have been skipped');
                        });
                }
        });

        sugarFree.describe.skip('Pending suite (describe.skip)', function(){
                sugarFree.it('Pending', function() {
                        throw Error('Should have been skipped');
                });
        });

        sugarFree.describe('Pending Suite: skip=true', function() {
                sugarFree.it('Pending', function() {
                        throw Error('Should have been skipped');
                });
        }, {skip: true});

        sugarFree.context('Suite ( context )', function() {
                sugarFree.it('Pass', function() {
                        ++counter;
                });
        });

        // final check to find out if everything fired properly
        sugarFree.after(function afterEverything() {
                assert.equal(counter, 20, 'After: counter should be 20, not ' + counter);
        });
});
