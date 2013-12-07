var tar = require('tar');
var _ = require('lodash');

var docker = require('docker-simple-wrapper');

var functions = {

  tarckerJson: function (state, next) {

    state.stream.resume();

    var stream = state.stream.pipe(tar.Parse());

    var data = '';

    stream
      .on('entry', function (e) {
        e.on('data', function (chunk) {
          if (e.props.path === './tarcker.json') {
            data += chunk.toString();
          }
        });
      })
      .on('end', function () {

        if (!data) {
          return next(null, state); 
        }

        try {
          state.tarcker_json = JSON.parse(data);
        } catch (e) {
          return next('There is a problem parsing the tarcker.json file. \n' + e);
        }

        next(null, state);
      });
    
  },

  createImage: function (state, next) {

    state.stream.resume();

    var options = { 
      method: 'POST', 
      path: '/build?t=image-' + state.name, 
      headers: { 'Content-Type': 'application/tar' }, 
      stream: state.stream,
    };

    docker(options, function (error, response, body) {

      if (error) {
        return next(error); 
      }

      console.log('--->'.green, 'Created image:', 'image-' + state.name);

      next(null, state);

    });
    
  },

  stopContainer: function (state, next) {

    var options = {
      method: 'POST',
      path: '/containers/' + state.name + '/stop',
    };

    docker(options, function (error, response, body) {

      if (error || response.statusCode !== 204 && response.statusCode !== 404) {
        return next(error || body); 
      }

      next(null, state);

    });
    
  },

  removeContainer: function (state, next) {

    var options = {
      method: 'DELETE',
      path: '/containers/' + state.name,
    };

    docker(options, function (error, response, body) {

      if (error || response.statusCode !== 204 && response.statusCode !== 404) {
        return next(error || body); 
      }

      next(null, state);

    });
    
  },

  createContainer: function (state, next) {

    var config = state.tarcker_json && state.tarcker_json.create;
    var body = _.extend({ Image: 'image-' + state.name }, config);

    var options = {
      method: 'POST',
      path: '/containers/create?name=' + state.name,
      headers: { 'Content-Type': 'application/json' }, 
      body: body,
    };

    docker(options, function (error, response, body) {

      if (error || response.statusCode !== 201) {
        return next(error || body); 
      }

      next(null, state);

    });
    
  },

  startContainer: function (state, next) {

    var config = state.tarcker_json && state.tarcker_json.start;

    var options = {
      method: 'POST',
      path: '/containers/' + state.name + '/start',
    };

    if (config) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = config;
    }

    docker(options, function (error, response, body) {

      if (error || response.statusCode !== 204) {
        return next(error || body); 
      }

      console.log('--->'.green, 'Started container:', state.name);

      next(null, state);
      
    });
    
  },

};

module.exports = functions;
