this.Views.FbInfoView = Backbone.View.extend({
				id:"fbInfo",
				template: _.template($('#fbinfo-template').html()),

				initialize:function(){
					console.log("init fb info view");
					this.listenTo(this.model.get("facebookProxy"), 'change:fbUser', this.showFBUser);
					this.render();
				},

				events:{
					"click #fbLogoutButton": "doLogout"
				},

				doLogout:function(){
					this.model.get("facebookProxy").doLogout();
				},
				
				showFBUser:function(){
					console.log("show fb user");
					this.render();	
				},

				render:function(){
					this.$el.html(this.template(this.model.get("facebookProxy").attributes));
					console.log("render fb info view");
					return this;
				}
			});