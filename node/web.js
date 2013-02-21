
var express = require('express'),
    app = express.createServer(express.logger());


var mongo = require('mongodb');
var connetionString = 'mongodb://fdjdb:49ikk29s8@linus.mongohq.com:10048/app11333631';
var DB = null;

mongo.connect(connetionString, function(err, db){
    DB = db;
    });




app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/song/:songId/:songName/:songArtist?', function(request, response) {
  
  var t = this;
  var vars = request.params;
  var songReturn = {result:null, song:null, request:null};
  var originalRequest = {songId:vars.songId, songName: vars.songName, songArtist:vars.songArtist };
  songReturn.request = originalRequest;

  var c = DB.collection('cached_yt_songs');
  var jsNow = new Date(new Date().getTime());

  var now = new Date(jsNow.getTime());
  var cacheDate = new Date(jsNow.setDate(jsNow.getDate()-3));


  var doc = c.findOne({songId:vars.songId, created_on:{$gt:cacheDate, $lte:now}}, function(err, cachedSong) {
      
      if(cachedSong==null){
        var newSong = {songId: vars.songId, songName: vars.songName, created_on:now};
        c.update({songId:vars.songId},newSong,{upsert:true});

        songReturn.result = 'new';
        songReturn.song = newSong;

      }else{
        songReturn.result = 'cached';
        songReturn.song = cachedSong;

      }
      response.send(songReturn);
  });


  
});

var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000


app.listen(port, function() {
  console.log(port);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});





