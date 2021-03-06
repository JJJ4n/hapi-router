'use strict';

var fs = require('fs');
var path = require('path');

exports.register = function (server, options, next) {
  var routes = [];

  function readRoutes (dir) {
    fs.readdirSync(dir).forEach(function (file) {
      var stat = fs.statSync(dir + file);
      if (stat && stat.isDirectory()) {
        return readRoutes(dir + file + '/');
      } else {
        // istanbul ignore else
        if (path.extname(file) === '.js') {
          var route = require(dir + file);
          routes = routes.concat(route);
        };

        return routes;
      }
    });
  };

  readRoutes(options.routesDir);
  server.route(routes);
  next();
};

exports.register.attributes = {
  multiple: false,
  pkg: require('../package.json')
};
