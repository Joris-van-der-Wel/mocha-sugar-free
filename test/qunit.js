'use strict';

var assert = require('assert');
var sugarFree = require('..');

sugarFree.suite('mocha-sugar-free: qunit');

sugarFree.test('Should only export qunit methods', function() {
        assert.deepEqual(
                Object.keys(sugarFree).sort(),
                ['detectedInterface', 'run', 'suite', 'test']
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


