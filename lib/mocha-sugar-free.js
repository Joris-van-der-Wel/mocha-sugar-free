'use strict';

var extend = require('xtend');
var globalScope = require('./global-scope')();

function inWebWorkerContext() {
        /* globals WorkerGlobalScope, self */
        return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
}

function inBrowserContext() {
        /* globals window */
        return (typeof window === 'object' && window === window.self) || inWebWorkerContext();
}

function skips(options) {
        if (options.skip) {
                return true;
        }

        if (options.skipIfBrowser && inBrowserContext()) {
                return true;
        }

        if (options.skipUnlessBrowser && !inBrowserContext()) {
                return true;
        }

        if (options.skipIfWebWorker && inWebWorkerContext()) {
                return true;
        }

        return false;
}

// recognisable name because it might show up in stack traces
var runUserTestFunc = function $mochaNoSugar$runUserTestFunc(func, mochaThis, options, done) {
        if ('timeout' in options) {
                mochaThis.timeout(options.timeout);
        }

        if ('slow' in options) {
                mochaThis.slow(options.slow);
        }

        if ('enableTimeouts' in options) {
                mochaThis.enableTimeouts(options.enableTimeouts);
        }

        var context = {
                isSuite       : !!options.isSuite,
                isTest        : !!options.isTest,
                isHook        : !!options.isHook,
                hook          : options.hook,

                skip          : mochaThis.skip           && mochaThis.skip          .bind(mochaThis),
                timeout       : mochaThis.timeout        && mochaThis.timeout       .bind(mochaThis),
                slow          : mochaThis.slow           && mochaThis.slow          .bind(mochaThis),
                enableTimeouts: mochaThis.enableTimeouts && mochaThis.enableTimeouts.bind(mochaThis),
                done          : done
        };

        if (func) {
                var returnValue = func(context);

                if (options.expectPromise) {
                        if (!returnValue || typeof returnValue.then !== 'function') {
                                throw Error('This test case or hook should always return a promise: '
                                        + '"' + options.title + '"' + (func.name ? ' ('+func.name+')' : ''));
                        }
                }

                return returnValue;
        }
};

function copyFunctionName(source, target) {
        if (source && source.name) {
                try {
                        Object.defineProperty(target, 'name', {value: source.name});
                }
                catch (err) {
                        // pre-ES6
                }
        }

        return target;
}

function run() {
        // (for use with the --delay option)
        globalScope.run();
}

function describe(title, func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { isSuite: true });

        if (typeof title === 'string') {
                options.title = title;
        }

        if (typeof func === 'function') {
                options.fn = func;
        }

        var myFunc = function $mochaNoSugar() {
                return runUserTestFunc(options.fn, this, options);
        };

        copyFunctionName(options.fn, myFunc);

        var mochaFn = globalScope.describe || globalScope.suite;

        if (skips(options)) {
                mochaFn.skip(options.title, myFunc);
        }
        else if (options.only) {
                mochaFn.only(options.title, myFunc);
        }
        else {
                mochaFn(options.title, myFunc);
        }
}

function describeSkip(title, func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { skip: true });

        if (typeof title === 'string') {
                options.title = title;
        }

        if (typeof func === 'function') {
                options.fn = func;
        }

        describe(options);
}

function describeOnly(title, func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { only: true });

        if (typeof title === 'string') {
                options.title = title;
        }

        if (typeof func === 'function') {
                options.fn = func;
        }

        describe(options);
}

function qunitSuite(title, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { isSuite: true });

        if (typeof title === 'string') {
                options.title = title;
        }

        if (skips(options)) {
                throw Error('Skipping suites is not supported in mocha\'s qunit interface');
        }
        else if (options.only) {
                globalScope.suite.only(options.title);
        }
        else {
                globalScope.suite(options.title);
        }
}

function qunitSuiteOnly(title, func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { only: true });

        if (typeof title === 'string') {
                options.title = title;
        }

        qunitSuite(options);
}

function it(title, func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { isTest : true });

        if (typeof title === 'string') {
                options.title = title;
        }

        if (typeof func === 'function') {
                options.fn = func;
        }

        var mochaFn = globalScope.it || globalScope.test;

        if (skips(options)) {
                mochaFn.skip(options.title);

                return;
        }

        var myFn;

        if (options.async) {
                myFn = function $mochaNoSugar(done) {
                        return runUserTestFunc(options.fn, this, options, done);
                };
        }
        else {
                myFn = function $mochaNoSugar() {
                        return runUserTestFunc(options.fn, this, options, null);
                };
        }

        copyFunctionName(options.fn, myFn);

        if (options.only) {
                mochaFn.only(options.title, myFn);
        }
        else {
                mochaFn(options.title, myFn);
        }
}

function itSkip(title) {
        var mochaFn = globalScope.it || globalScope.test;
        mochaFn.skip(title);
}

function itOnly(title, func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { only : true });

        if (typeof title === 'string') {
                options.title = title;
        }

        if (typeof func === 'function') {
                options.fn = func;
        }

        it(options);
}

function before(func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { isHook : true, hook : 'before' });

        if (typeof func === 'function') {
                options.fn = func;
        }

        var mochaFn = globalScope.before || globalScope.suiteSetup;

        if (skips(options)) {
                // noop
        }
        else if (options.async) {
                mochaFn(
                        copyFunctionName(options.fn, function $mochaNoSugar(done) {
                                return runUserTestFunc(options.fn, this, options, done);
                        })
                );
        }
        else {
                mochaFn(
                        copyFunctionName(options.fn, function $mochaNoSugar() {
                                return runUserTestFunc(options.fn, this, options, null);
                        })
                );
        }
}

function after(func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { isHook : true, hook : 'after' });

        if (typeof func === 'function') {
                options.fn = func;
        }

        var mochaFn = globalScope.after || globalScope.suiteTeardown;

        if (skips(options)) {
                // noop
        }
        else if (options.async) {
                mochaFn(
                        copyFunctionName(options.fn, function $mochaNoSugar(done) {
                                return runUserTestFunc(options.fn, this, options, done);
                        })
                );
        }
        else {
                mochaFn(
                        copyFunctionName(options.fn, function $mochaNoSugar() {
                                return runUserTestFunc(options.fn, this, options, null);
                        })
                );
        }
}

function beforeEach(func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { isHook : true, hook : 'beforeEach' });

        if (typeof func === 'function') {
                options.fn = func;
        }

        var mochaFn = globalScope.beforeEach || globalScope.setup;

        if (skips(options)) {
                // noop
        }
        else if (options.async) {
                mochaFn(
                        copyFunctionName(options.fn, function $mochaNoSugar(done) {
                                return runUserTestFunc(options.fn, this, options, done);
                        })
                );
        }
        else {
                mochaFn(
                        copyFunctionName(options.fn, function $mochaNoSugar() {
                                return runUserTestFunc(options.fn, this, options, null);
                        })
                );
        }
}

function afterEach(func, options_) {
        var options = arguments[arguments.length - 1];
        options = typeof options === 'object' ? options : {};
        options = extend(options, { isHook : true, hook : 'afterEach' });

        if (typeof func === 'function') {
                options.fn = func;
        }

        var mochaFn = globalScope.afterEach || globalScope.teardown;

        if (skips(options)) {
                // noop
        }
        else if (options.async) {
                mochaFn(
                        copyFunctionName(options.fn, function $mochaNoSugar(done) {
                                return runUserTestFunc(options.fn, this, options, done);
                        })
                );
        }
        else {
                mochaFn(
                        copyFunctionName(options.fn, function $mochaNoSugar() {
                                return runUserTestFunc(options.fn, this, options, null);
                        })
                );
        }
}

if (globalScope.suite && globalScope.test && globalScope.setup) { // tdd

        module.exports = {
                detectedInterface: 'tdd',
                run              : run,
                suite            : describe,
                test             : it,
                suiteSetup       : before,
                suiteTeardown    : after,
                setup            : beforeEach,
                teardown         : afterEach
        };
        module.exports.suite.skip = describeSkip;
        module.exports.suite.only = describeOnly;
        module.exports.test.skip = itSkip;
        module.exports.test.only = itOnly;
}
else if (globalScope.suite && globalScope.test && globalScope.before) { // qunit

        module.exports = {
                detectedInterface: 'qunit',
                run              : run,
                suite            : qunitSuite,
                test             : it
        };
        module.exports.suite.only = qunitSuiteOnly;
        module.exports.test.skip = itSkip;
        module.exports.test.only = itOnly;
}
else if (globalScope.describe && globalScope.it && globalScope.before) { // bdd

        module.exports = {
                detectedInterface: 'bdd',
                run              : run,
                describe         : describe,
                xdescribe        : describeSkip,
                it               : it,
                xit              : itSkip,
                before           : before,
                after            : after,
                beforeEach       : beforeEach,
                afterEach        : afterEach
        };
        module.exports.describe.skip = describeSkip;
        module.exports.describe.only = describeOnly;
        module.exports.it.skip = itSkip;
        module.exports.it.only = itOnly;
}
else {
        throw Error(
                'Unsupported mocha interface. bdd, tdd and qunit are supported. ' +
                'Or, this script has been executed without mocha'
        );
}
