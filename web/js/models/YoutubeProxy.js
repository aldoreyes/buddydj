FDJ.Models.YoutubeProxy = Backbone.Model.extend({
				
	initialize:function(){
		this.set('loaded', false);
		this.set('playing', false);

	},

	loadAndInit:function(){
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/player_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		window.onYouTubePlayerAPIReady = $.proxy(this.onYouTubePlayerAPIReady, this);
	},

	onYouTubePlayerAPIReady:function(){
		this.set("loaded", true);
	},

	play:function(song){
		this.set('song', song);
	},

	pause:function(){
	},

	getYouTubeSongInfo:function(song){
		console.log(song.data.song.id, song.data.song.title);

		$.getJSON('http://127.0.0.1:5000/song/'+song.data.song.id + "/" + song.data.song.title + "/" + song.artist, function(data) {
			 console.log(data);
			 console.log(data.song.songYTData.media$group.media$player.url);
		});
	},

	__onStateChange:function(object){
		this.set('state', object.data, YT.PlayerState.ENDED);
		if(object.data == YT.PlayerState.ENDED){
			this.trigger('complete');
		}
	}
});