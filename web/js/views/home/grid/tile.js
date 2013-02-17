FDJ.Views.TileView = Backbone.View.extend({
	template: _.template($('#tile-template').html()),
	className: 'song',

	render:function(){
		this.$el.html(this.template(this.model.attributes));
		this.$el.attr('data-symbol', this.model.get('publish_time_mili'));
		return this;
	}
});