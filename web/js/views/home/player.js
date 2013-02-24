FDJ.Views.YTPlayer = Backbone.View.extend({
	id:"yt-player",
	tagName:"div",
	
	initialize:function(){
		this.listenTo(this.model, 'change:loaded', this.createPlayer);
		this.listenTo(this.model, 'change:song', this.onSongChange);
	},

	onSongChange:function(){
		this.get('player').loadVideoById(this.model.get('song').get('videoId'));
	},

	createPlayer:function(){
		this.stopListening(this.model, "change:loaded");
		this.model.set('player', new YT.Player('yt-player', {
			playerVars: {'autoplay':0, 'controls':0},
	      height: '480',
	      width: '640',
	      videoId: 'ex2E4vyGem0',
	    }));
	}

});