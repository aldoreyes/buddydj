this.Views.HomeView = Backbone.View.extend({
				id:"home",
				template: _.template($('#home-template').html()),

				initialize:function(){
					console.log("init home");
					this.render();	
					this.$('#fbInfoViewEl').html(new FDJ.Views.FbInfoView({ model: this.model }).$el);
					this.$('#gridViewEl').html(new FDJ.Views.GridView({ model: this.model }).$el);
						
					
				},


				render:function(){
					console.log("render home");
					//console.log(this.model.get("facebookProxy").attributes);
					this.$el.html(this.template());
					return this;
				}
			});