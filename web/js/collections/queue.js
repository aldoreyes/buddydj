FDJ.Collections.Queue = Backbone.Collection.extend({
	model:FDJ.Models.Song,
	url:"http://fdjnode.herokuapp.com/song/"
});