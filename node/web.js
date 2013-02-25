
var express = require('express'),
    http = require("http"), 
    app = express.createServer(express.logger());


var mongo = require('mongodb');
var connetionString = 'mongodb://fdjdb:49ikk29s8@linus.mongohq.com:10048/app11333631';
var DB = null;
var youTubeKey = 'AI39si7wn5CUxjC2ktbcy-Xg7YpL6S3DQFiQg4wU8JdxB2dJp1vnfH1dHlW8YQm6aRb-sZCQMSLpJirEjtnLxQAN0a0uzshWjQ';

mongo.connect(connetionString, function(err, db){
    DB = db;
    });


app.all('*', function(req, res, next) {

  var allowedHost = [
    'http://fdj.local',
    'http://fdjweb.herokuapp.com',
    'http://fdjnode.herokuapp.com',
    'http://localhost'
  ];
  //allow CORS 
  console.log("REQUEST START");
  console.log("req origin", req.headers.origin, allowedHost.indexOf(req.headers.origin));
  if(allowedHost.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  }else{
    res.send({auth: false});
  }
});

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/song/:songId/:songName/:songArtist?', function(request, response) {
  
  var t = this;
  var vars = request.params;
  var songReturn = {result:null, song:null, request:null, ytquery:null};
  var originalRequest = {songId:vars.songId, songName: vars.songName, songArtist:vars.songArtist };
  songReturn.request = originalRequest;

  var c = DB.collection('cached_yt_songs');
  var jsNow = new Date(new Date().getTime());

  var now = new Date(jsNow.getTime());
  var cacheDate = new Date(jsNow.setDate(jsNow.getDate()-3));


  var doc = c.findOne({songId:vars.songId, created_on:{$gt:cacheDate, $lte:now}}, function(err, cachedSong) {
      
      if(cachedSong==null){
        //go out and make requsest to youtube
 
        var ytSongName = encodeURIComponent("\"" + vars.songName +"\"");
        var ytArtistName = ((vars.songArtist!=null) ? encodeURIComponent("\"" + vars.songArtist +"\"") : "");
        var ytQuery = ytSongName + ytArtistName;
   
        var options = {
          hostname: 'gdata.youtube.com',
          port: 80,
          path: '/feeds/api/videos?q=title:'+ ytQuery +'&max-results=1&v=2&alt=json&fields=entry(title,media:group(media:player,yt:videoid),yt:statistics(@viewCount))&orderby=viewCount&key=' + youTubeKey,
          method: 'GET'
        };
        

        var req = http.request(options, function(res) {

          res.setEncoding('utf8');
          
          res.on('data', function (ytResponse) {
            
             var ytResponse = JSON.parse(ytResponse); 

             if(ytResponse.feed.entry){
                //console.log(options.hostname + options.path);
                var firstSong = ytResponse.feed.entry[0];
                var newSong = {songId: vars.songId, songName: vars.songName, songYTData:firstSong, created_on:now};
                c.update({songId:vars.songId},newSong,{upsert:true});

                songReturn.loaded = true;
                songReturn.videoId = firstSong["media$group"]["yt$videoid"]['$t'];
                
                //songReturn.result = 'new';
                //songReturn.song = newSong;
                //songReturn.ytquery = ytQuery;
                response.send(songReturn);

             }else{

                songReturn.result = {error:'no song returned from YT!'};
                songReturn.ytquery = ytQuery;
                response.send(songReturn);

             }

          });
        });

        req.on('error', function(e) {
          songReturn.videoId = -1;
          //songReturn.ytquery = ytQuery;
          response.send(songReturn);
          //console.log('problem with request: ' + e.message);
        });


        req.end();

      }else{

        songReturn.loaded = true;
        songReturn.videoId = cachedSong.songYTData["media$group"]["yt$videoid"]['$t'];
                
        response.send(songReturn);

      }
      
  });


  
});

var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000

app.listen(port, function() {
  console.log(port);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});





