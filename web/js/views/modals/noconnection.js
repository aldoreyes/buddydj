FDJ.Views.NoConnectionView = Backbone.View.extend({
				id:"noconnection",
				template: _.template($('#noconnection-template').html()),

				initialize:function(){
					
					
						
					this.render();
					console.log("no connection out init");


					this.listenTo(this.model.get('facebookProxy'), 'change:statusError', this.onStatusError);
					
					
						
					
				},

				onStatusError:function(e){
					if(e.attributes.statusError == FDJ.Models.constructor.NO_ERROR){
						//console.log("AFTER ERROR RESUME NORMAL ACTIVITY!");
						this.remove();
					}
				},

				
				
				events:{
					"click #ignore": "doIgnore"
				},
				
				doIgnore:function(){
					//this.model.get('facebookProxy').set('statusError', NO_ERROR);
					this.remove();
					
					event.preventDefault();
					
				},



				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});