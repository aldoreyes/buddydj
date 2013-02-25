FDJ.Views.YTPlayer = Backbone.View.extend({
	id:"yt-player",
	tagName:"div",
	
	initialize:function(){
		this.listenTo(this.model, 'change:loaded', this.createPlayer);
		this.listenTo(this.model, 'change:song', this.onSongChange);
		this.listenTo(this.model, 'change:paused', this.onPausedChange);
	},

	onSongChange:function(){
		this.model.get('player').loadVideoById(this.model.get('song').get('videoId'));
	},

	onPausedChange:function(){
		if(!this.model.get('paused')){
			this.model.get('player').playVideo();
		}else{
			this.model.get('player').pauseVideo();
		}
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