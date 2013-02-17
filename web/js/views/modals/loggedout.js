FDJ.Views.LoggedOutView = Backbone.View.extend({
				
				id:"loggedout",
				template: _.template($('#loggedout-template').html()),

				initialize:function(){
					
					this.render();
					console.log("logged out init");

					this.listenTo(this.model.get('facebookProxy'), 'change:statusError', this.onStatusError);
					
				},

				onStatusError:function(e){
					
					if(e.attributes.statusError == FDJ.Models.constructor.NO_ERROR){
						this.remove();
					}

				},
				
				events:{
					"click #fbReLoginButton": "doReLogin"
				},
				
				doReLogin:function(){

					this.model.get('facebookProxy').doReLogin();
					event.preventDefault();
					
				},



				render:function(){

					this.$el.html(this.template());
					return this;

				}
				
			});