FDJ.Views.HeaderView = Backbone.View.extend({
	id:"header",
	template:_.template($('#header-template').html()),

	initialize:function(){
		this.render();
		this.listenTo(this.model.get('youtubeProxy'), 'change:paused', this.onPausedChange);
		this.listenTo(this.model, 'change:current_song', this.onSongChange);
	},

	events:{
		"click #play_button": "doPlayPause",
		"click #skip_button": "doSkip"
	},

	doPlayPause:function(){
		console.log("doPlayPause");
		this.model.get('youtubeProxy').pause();
	},

	doSkip:function(){
		this.model.playNext();
	},
	render:function(){
		this.$el.html(this.template());
		return this;
	},

	onPausedChange:function(){
		if(this.model.get('youtubeProxy').get('paused')){
			this.$('#play_button').html('Play');
		}else{
			this.$('#play_button').html('Pause');
		}
	},
	onSongChange:function(){
		this.$('#header-current-song > p').html("Currently playing: "+this.model.get('current_song').get('data').song.title);
	}
});