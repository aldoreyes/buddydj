FDJ.Models.YoutubeProxy = Backbone.Model.extend({
				
	initialize:function(){
		this.set('loaded', false);
		

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
	}
});