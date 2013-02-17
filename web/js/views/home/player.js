FDJ.Views.YTPlayer = Backbone.View.extend({
	id:"yt-player",
	tagName:"div",
	
	initialize:function(){
		this.listenTo(this.model, 'change:loaded', this.createPlayer);
	},

	createPlayer:function(){
		console.log('createPlayer', this.el);
		this.stopListening(this.model, "change:loaded");
		this.model.set('player', new YT.Player('yt-player', {
	      height: '390',
	      width: '640',
	      videoId: 'ex2E4vyGem0',
	      autoplay: 1
	    }));
	}

});