
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http')
    geo = require('./geo'),
    nowjs = require("now");


var app = module.exports = express.createServer()

var everyone = nowjs.initialize(app);

everyone.now.sendData = function(data) {
  if(ip.check(data.ip)) {
    ip.locate(data.ip, function(location) {
      if(location[0] && location[1]) {
        var target = new geo(model.target[0], model.target[1]);
        var userTry = new geo(location[0], location[1]);
        var dist = target.distanceTo(userTry);
        
        model.players.push({
          name: data.username,
          ip: data.ip,
          geo: location,
          dist: dist
        });
        everyone.now.update(model);
      }
    });
  };
}

everyone.on('connect',function(){
  if (typeof everyone.now.update === 'function') {
    everyone.now.update(model);
  }
})

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var model = {
  target: [],
  players: [],
  winners: [],
};

// Routes

var ip = (function(){
  var generate = function(callback) {
    var generatedIp = [
      ~~(Math.random() * 255),
      ~~(Math.random() * 225),
      ~~(Math.random() * 225),
      ~~(Math.random() * 254 + 1)
    ];

    ip.locate(generatedIp.join('.'), function(location) {
      if(location[0] && location[1]) {
        model.target = location;
        if (typeof callback !== 'undefined') {
          callback();
        }
      } else {
        generate();
      }
    });
    
  };
    return {
    generate: generate,
    locate: function(ip, callback) {
      var yql = {
        get: {
          host:'query.yahooapis.com',
          port: 80,
          path: '/v1/public/yql?'
        },
        params: ['format=json', 'env=store://datatables.org/alltableswithkeys'],
        query: 'SELECT Latitude, Longitude FROM ip.location WHERE key = "458e9dfc4c09041bba9fbf24e6a5d69ef348fbc85fd7b6646a5f73efe67c1fe2" AND '
      };
      
      yql.query += 'ip = "' + ip + '"';
      
      // yql.params.push('diagnostics=true');
      yql.params = yql.params.map(function(param){
        param = param.split("=");
        param[1] = encodeURIComponent(param[1]);
        return param.join('=');
      });
      yql.params.push('q=' + encodeURIComponent(yql.query));
      yql.get.path += yql.params.join('&');
      
      var result = http.get(yql.get, function(response){
        var result = '';
        response.on('data', function(data) {
          result += data.toString();
        });

        response.on('end', function() {
          var data = JSON.parse(result);
          callback([data.query.results.Response.Latitude, data.query.results.Response.Longitude]);
        });
      });
    },
    check: function(ip) {
      return !!ip.match(/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/);
    }
  };
}());

ip.generate();

model.timeout = setInterval(function(){
  console.log('test');
  ip.generate(function(){
    var i, player_id;
    var min = Number.MAX_VALUE;
    
    for (i in model.players) {
      if (min > model.players[i].dist) {
        player_id = i;
        min = model.players[i].dist;
      }
    }
    if (min !== Number.MAX_VALUE) {
      model.winners.push(model.players[i].name);
    }
    model.players = [];
  });
}, 60000);

app.get('/', function(req, res){
  res.render('index', {
    title: 'GeoIP',
    guessip: false,
    username: false,
    text: ''
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
