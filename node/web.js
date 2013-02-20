/*
var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
*/
var io = require('socket.io').listen(8080);
var mongo = require('mongodb');
var connetionString = 'mongodb://fdjdb:49ikk29s8@linus.mongohq.com:10048/app11333631';
var DB = null;

mongo.connect(connetionString, function(err, db){
    DB = db;
    });


io.sockets.on('connection', function (socket) {
  
  //socket.emit('news', { hello: 'world' });
  
  /*
  socket.on('my other event', function (data) {
    console.log(data);
  });  
    */

  socket.on('getYtSong', function (data) {
    console.log("Getting Song Id: " + data.songId);

    var songReturn = {result:null, song:null};
    var c = DB.collection('cached_yt_songs');
    var jsNow = new Date(new Date().getTime());

    var now = new Date(jsNow.getTime());
    var cacheDate = new Date(jsNow.setDate(jsNow.getDate()-3));


    var doc = c.findOne({songId:data.songId, created_on:{$gt:cacheDate, $lte:now}}, function(err, cachedSong) {
        
        if(cachedSong==null){
          var newSong = {songId: data.songId, songName: data.songName, created_on:now};
          c.update({songId:data.songId},newSong,{upsert:true});

          songReturn.result = 'new';
          songReturn.song = newSong;

        }else{
          songReturn.result = 'cached';
          songReturn.song = cachedSong;

        }

         socket.emit('onGetYtSong', songReturn);

    });
   
  });
});