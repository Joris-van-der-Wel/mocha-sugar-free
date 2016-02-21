mocha-sugar-free
================
Write mocha test cases without using globals or `this`. Browserify compatible. Mocha without the sugar.

example
-------

```javascript
// Note: this example uses ES6 features, however this module does not require it.

const describe = require('mocha-sugar-free').describe;
const it = require('mocha-sugar-free').it;
const assert = require('assert');

describe('Tutorial', suiteContext => {
    suiteContext.timeout(100); // a default timeout for tests within this suite

    it('should demonstrate a simple example', () => assert.equal(10 / 2, 5) );
    
    // You can use arrow functions, which is not supported in regular mocha:
    it('should demonstrate that `this` is not used', context => {
        context.slow(1); // warn that the test is slow if it takes more than 1ms
        context.timeout(5); // should timeout after 5ms
        context.enableTimeouts(true); // enable timeout checking (enabled by default in mocha)
        context.skip(); // mark this test as skipped
        console.info('You should never see this message because of `skip()`');
    });
    
    it('should demonstrate that asynchronous tests are defined by an option', context => {
        setTimeout(() => context.done(), 1000);
    }, {async: true, timeout: 1500});
    
    it({
        title: 'should demonstrate all of the options that you can use',
        fn() {
            assert.equal(10 / 2, 5);
        },
        async: false, // is this an asynchronous test? 
                      // if you return a Promise in your test, you do not have to set this
        enableTimeouts: true, // same as context.enableTimeouts()
        timeout: 25,          // same as context.timeout()
        slow: 10,             // same as context.slow()
        skip: false,              // always skip this test?
        skipIfBrowser: false,     // skip this test if it is run in a web browser?
        skipUnlessBrowser: false, // skip this test if it is run in node.js?
        skipIfWebWorker: false,   // skip this test if it is ran in a Web Worker?
        expectPromise: false  // throw an exception if the test function does not 
                              // return a Promise (thenable)?
    });
});

```

Test cases that use `mocha-sugar-free` are run in the same way as normal mocha test cases, you can even mix them. You can not use `mocha-sugar-free` standalone, you should run your test cases using `mocha foo.js` (not `node foo.js`)

