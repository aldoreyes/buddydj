FDJ.Views.HomeView = Backbone.View.extend({
				
				id:"home",
				template: _.template($('#home-template').html()),

				initialize:function(){
					
					console.log("init home");
					this.render();	
					
					this.$('#fbInfoViewEl').html(new FDJ.Views.FbInfoView({ model: this.model }).$el);
					this.$('#gridViewEl').html(new FDJ.Views.GridView({ model: this.model }).$el);
					
					this.listenTo(this.model.get('facebookProxy'), 'change:statusError', this.onStatusError);
						
				},

				onStatusError:function(e){
					
					if(e.attributes.statusError == USER_LOGGEDOUT){
						
						console.log("status error: user logged out");
						//ask user to log back in
						this.$('#modalViewEl').html(new FDJ.Views.LoggedOutView({ model: this.model }).$el);
						  
					}else if(e.attributes.statusError == CONNECTION_LOST){

						console.log("status error: connection lost");
						this.$('#modalViewEl').html(new FDJ.Views.NoConnectionView({ model: this.model }).$el);

					}else if(e.attributes.statusError == NO_ERROR){

						console.log("AFTER ERROR RESUME NORMAL ACTIVITY!");

					}else if(e.attributes.statusError == UNKNOWN_ERROR){

						console.log("UNKNOWN_ERROR problem");

					}else{

						console.log("other problem");

					}

				},


				render:function(){

					console.log("render home");
					//console.log(this.model.get("facebookProxy").attributes);
					this.$el.html(this.template());
					return this;

				}

			});