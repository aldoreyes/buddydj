FDJ.Views.TileView = Backbone.View.extend({
	template: _.template($('#tile-template').html()),
	className: 'song',

	events:{
		"click .play": "playSong"
	},	

	render:function(){
		this.$el.html(this.template(this.model.attributes));
		this.$el.attr('data-symbol', this.model.get('publish_time_mili'));
		return this;
	},

	playSong:function(){
		event.preventDefault();
		
		window.model.get("youtubeProxy").getYouTubeSongInfo(this.model.attributes);
		//console.log(this.model.attributes);
	}
});