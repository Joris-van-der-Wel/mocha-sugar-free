'use strict';

module.exports = function(config) {
        config.set({
                basePath     : '',
                frameworks   : ['mocha-webworker', 'browserify'],

                // stuff to send to the browser
                files        : [
                        {pattern: 'lib/*'               , watched: true, served: false, included: false},
                        {pattern: 'test/browser-skip.js', watched: true, served: true , included: false},
                        {pattern: 'test/bdd.js'         , watched: true, served: true , included: false}
                ],

                preprocessors: {
                        'test/*': [ 'browserify' ]
                },

                browserify   : {
                        debug: true
                },

                client       : {
                        mochaWebWorker: {
                                pattern: false // include all served files
                        }
                },

                // possible values: 'dots', 'progress'
                reporters    : ['progress'],
                port         : 9876,
                colors       : true,
                // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
                // config.LOG_INFO || config.LOG_DEBUG
                logLevel     : config.LOG_INFO,
                autoWatch    : true,

                // Do not auto start, just navigate your browser to http://localhost:9876/
                browsers     : [],
                singleRun    : false
        });
};
