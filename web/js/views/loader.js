this.Views.LoaderView = Backbone.View.extend({
				id:"loader",
				template: _.template($('#loader-template').html()),

				initialize:function(){
					this.model.set('current_view',this);
					console.log("loader init");
					this.render();
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});