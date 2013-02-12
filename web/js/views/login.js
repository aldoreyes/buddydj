this.Views.LoginView = Backbone.View.extend({
				id:"login",
				template: _.template($('#login-template').html()),

				initialize:function(){
					console.log("login init");
					this.render();
				},
				
				
				events:{
					"click #fbLoginButton": "doLogin"
				},
				
				doLogin:function(){
					
					this.model.get('facebookProxy').doLogin();
					event.preventDefault();
					
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});