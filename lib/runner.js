"use strict";


// stdlib
var path = require("path");


// 3rd-party
var async = require("async");


////////////////////////////////////////////////////////////////////////////////


exports.bootstrap = function (appRoot, appConfig) {
  var N = global.N = {
    runtime: {
      // Application version
      version: require(path.join(appRoot, 'package.json')).version
    }
  };

  //
  // Catch unexpected exceptions
  //

  process.on('uncaughtException', function (err) {
    var msg, stack;

    try {
      msg   = 'UNCAUGHT EXCEPTION !!! ' + String(err);
      stack = err.stack || '';

      if (err.original) {
        msg += '\n' + String(err.original);
        stack = err.original.stack || stack;
      }

      msg += '\n' + stack.split('\n').slice(1).join('\n');

      N.logger.fatal(msg);
    } catch (loggerError) {
      // THIS SHOULD NEVER-EVER-EVER HAPPEN -- THIS IS A WORST CASE SCENARIO
      // USAGE: ./N.js 2>/var/log/N-cf.log
      process.stderr.write('\nLogger failed write: ' + loggerError.stack);
      process.stderr.write('\nOriginal error happened: ' + msg);
    }
  });

  //
  // Handle SIGnals
  //

  function shutdown_gracefully() {
    N.logger.info('Shutting down...');
    process.exit(0);
  }

  // shutdown gracefully on SIGTERM :
  process.on('SIGTERM', shutdown_gracefully);
  process.on('SIGINT',  shutdown_gracefully);

  // Notify about unclean exit
  process.on('SIGQUIT', function () {
    process.exit(1);
  });
};