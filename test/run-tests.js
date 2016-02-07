'use strict';

var childProcess = require('child_process');
var chalk = require('chalk');

function spawnTest() {
        var mochaBin = require.resolve('mocha/bin/_mocha');
        var args = Array.from(arguments); // (caution: deoptimize)
        args.unshift(mochaBin);

        console.log();
        console.log();
        console.log('========================================');
        console.log('Spawning: node', args);

        childProcess.spawnSync('node', args, {
                encoding: 'utf8',
                stdio   : 'inherit'
        });
}

spawnTest('test/browser-skip.js');
console.info(chalk.bgCyan(chalk.grey(
        '                                                           \n' +
        '   test/browser-skip.js: Expecting: ' + chalk.green('2 passing') + ', 1 pending   \n' +
        '                                                           '
)));

spawnTest('test/bdd.js');
console.info(chalk.bgCyan(chalk.grey(
        '                                                               \n' +
        '   test/bdd.js: Expecting: ' + chalk.green('19 passing') + ', 13 pending, '+chalk.red('3 failing')+'   \n' +
        '                                                               '
)));


spawnTest('--ui', 'tdd', 'test/tdd.js');
console.info(chalk.bgCyan(chalk.grey(
        '                                                  \n' +
        '   test/bdd.js: Expecting: ' + chalk.green('5 passing') + ', 4 pending   \n' +
        '                                                  '
)));

spawnTest('--ui', 'qunit', 'test/qunit.js');
console.info(chalk.bgCyan(chalk.grey(
        '                                                    \n' +
        '   test/qunit.js: Expecting: ' + chalk.green('3 passing') + ', 2 pending   \n' +
        '                                                    '
)));
