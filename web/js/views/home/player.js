FDJ.Views.YTPlayer = Backbone.View.extend({
	id:"yt-player",
	tagName:"div",
	
	initialize:function(){
		this.listenTo(this.model, 'change:loaded', this.createPlayer);
		this.listenTo(this.model, 'change:song', this.onSongChange);
	},

	onSongChange:function(){
		console.log("onSongChange");
		this.model.get('player').loadVideoById(this.model.get('song').get('videoId'));
		this.model.get('player').playVideo();
	},

	createPlayer:function(){
		this.stopListening(this.model, "change:loaded");
		this.model.set('player', new YT.Player('yt-player', {
			playerVars: {'autoplay':0, 'controls':1},
	      height: '480',
	      width: '640',
	      events:{
	      	'onStateChange': $.proxy(this.model.__onStateChange, this.model)
	      }
	    }));
	}

});