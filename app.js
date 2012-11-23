
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , sentiment = require('sentiment')
  , twitter = require('ntwitter');

var twit = new twitter({
        consumer_key: '0pjYFfUdWdHoBYBm60pVA',
        consumer_secret: 'zHDtnellc20tlIJ13W2KuKd9krGb4XF1c3IDHyqc',
        access_token_key: '804717-jldffQWKMhIfclE454z3HRMfrBObD5MCRmTUd6CTmA',
        access_token_secret: '4QyMtu3bDwtHGWffzyz5LW7l7yxweZtx2XZsKC1ErY'
});

watch_twitter = function() {
  twit.stream('statuses/filter', {track:'xfactor'}, function(stream) {
    stream.on('data', function (data) {
    parse_tweet(data);
  });

  stream.on('end', function (response) {
    console.log('disconnected  ');
    end();
  });

  stream.on('destroy', function (response) {
    console.log('disconnected  ');
    end();
  });
  });
}

parse_tweet = function(tweet) {
  if(!tweet.text) {
    return;
  }

  var text = tweet.text;

  sentiment(text, function (err, result) {
    console.log(result.score + " " + result.comparative + " " + text);
  });

  return true;
}

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Twitter sentiment server listening on port " + app.get('port'));
});

watch_twitter();
