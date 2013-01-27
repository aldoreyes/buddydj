/**
* Author: Aldo Reyes
**/
var FDJ = {
	Models : null,
	Collections : null,
	Views: null,

	initFramework : function(){
		if(!this.Models){
			this.Models = {};
			this.Views = {};
			this.Collections = {};

			/*****************
			*** MODELS
			******************/
			this.Models.MainModel = Backbone.Model.extend({
				initialize:function(){
					this.set('facebookProxy', new FDJ.Models.FacebookProxy());
				}
			});

			this.Models.FacebookProxy = Backbone.Model.extend({
				loadJDKAndInit:function(){
					window.fbAsyncInit = $.proxy(this.init, this);


					//load jdk
					(function(d){
					     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
					     if (d.getElementById(id)) {return;}
					     js = d.createElement('script'); js.id = id; js.async = true;
					     js.src = "//connect.facebook.net/en_US/all.js";
					     ref.parentNode.insertBefore(js, ref);
					   }(document));
				},

				init:function(){
					FB.init({
				      appId      : this.get('app_id'), // App ID
				      channelUrl : this.get('channel'), // Channel File
				      status     : true, // check login status
				      cookie     : true, // enable cookies to allow the server to access the session
				      xfbml      : true  // parse XFBML
				    });

				    this.trigger('init');
				}
			});

			this.Models.Song = Backbone.Model.extend({

			});


			/*****************
			*** COLLECTIONS
			******************/
			this.Collections.Queue = Backbone.Collection.extend({
				model:this.Models.Song
			});

			/*****************
			*** VIEWS
			******************/
			this.Views.MainQueue = Backbone.View.extend({

			});
			
			this.Views.LoaderView = Backbone.View.extend({
				id:"loader",
				template: _.template($('#loader-template').html()),

				initialize:function(){
					this.render();
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});
			

			this.Views.LoginView = Backbone.View.extend({
				className:"panel",
				template: _.template($('#login-template').html()),

				initialize:function(){
					this.render();
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});
			
			this.Views.PlayerView = Backbone.View.extend({
				id:"player",
				template: _.template($('#player-template').html()),

				initialize:function(){
					this.render();
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});

			this.Views.MainView = Backbone.View.extend({
				el:$("#main-container"),

				initialize:function(){
					//console.log(this.$el);
					//this.listenTo(this.model('facebookProxy', 'change:isLoggedIn', yourfunction)
					this.model.get('facebookProxy').loadJDKAndInit();
					var isLoggedIn = this.model.get('facebookProxy').get('isLoggedIn');
					
					var loaderView = new FDJ.Views.LoaderView().$el;
					var loginView = new FDJ.Views.LoginView().$el;
					var playerView = new FDJ.Views.PlayerView().$el;
					var debugView = new FDJ.Views.DebugPanel().$el;
					
					if(isLoggedIn){
						this.transitionTo(playerView);
					}
					
					this.$el.append(new FDJ.Views.LoaderView().$el);
					this.$el.append(new FDJ.Views.DebugPanel().$el);
				
				},
				
				transitionTo:function(view){
					//console.log("transtition" + $el);
					var obj = this.$el;
					
					obj.fadeOut(500, function() {
						//console.log($el);
						obj.html("");
					    obj.append(view);
						obj.fadeIn(500, function() {});
					});
					
				}

				
			});

			this.Views.DebugPanel = Backbone.View.extend({
				id:"debugpanel",
				template: _.template($('#debug-template').html()),

				events:{
					"click #debug-login-button": "doDebugLogin"
				},

				doDebugLogin:function(){
					console.log("doDebugLogin");
				},


				initialize:function(){
					this.render();
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});
		}
	},

	initApp:function(){
		window.model = new FDJ.Models.MainModel();
		window.view = new FDJ.Views.MainView({model:window.model});
		window.debug = new FDJ.Views.DebugPanel({model:window.model});
	},
	


};

$(function(){
	FDJ.initFramework();

	FDJ.initApp();
});