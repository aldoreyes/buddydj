FDJ.Views.NoSongsView = Backbone.View.extend({
				id:"nosongs",
				template: _.template($('#nosongs-template').html()),

				initialize:function(){
			
					this.render();
					console.log("no songs init");	
					
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});