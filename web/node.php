<script src="http://fdjnode.herokuapp.com/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://fdjnode.herokuapp.com');
  socket.emit('getYtSong', { songId: '44',songName:'libertadores' });
  
  socket.on('onGetYtSong', function (data) {
    console.log(data);
	});
  /*socket.on('news', function (data) {
    console.log(data);
    
    socket.emit('my other event', { my: 'data' });

    socket.emit('myevent', { my: 'test' });
  });
	*/

</script>