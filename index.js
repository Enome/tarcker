#!/usr/bin/node
require('colors');

var async = require('async');
var commander = require('commander');
var functions = require('./functions');

commander
  .version('0.0.0')
  .option('-n, --name <name>')
  .parse(process.argv);

if (!commander.name) {
  return console.log('--->'.red, 'Please specify a name (-n foobar or --name foobar)');
}

if (process.stdin.isTTY) {
  return console.log('--->'.red, 'Please pipe a tar directory (tar -c . | tarcker -n foobar)');
}

var state = {
  name: commander.name,
  stream: process.openStdin(),
};

state.stream.pause();

var fns = [

  function (next) { next(null, state); },

  function (state, next) {

    async.parallel([

      functions.tarckerJson.bind(null, state),
      functions.createImage.bind(null, state),  

    ], function (error) {

      if (error) {
        return next(error); 
      }

      next(null, state);
      
    });

  },

  functions.stopContainer,
  functions.removeContainer,
  functions.createContainer,
  functions.startContainer,

];

async.waterfall(fns, function (err) {

  if (err) {
    return console.log('--->'.red, err);
  }

  console.log('--->'.green, 'DONE');

});
