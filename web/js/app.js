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
					this.set('facebookProxy', new FDJ.Models.FacebookProxy({app_id:'480004502036911', channel:'/channel.php'}));
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

				    FB.getLoginStatus($.proxy(this.loginStatus, this));

				    this.trigger('init');
				},

				loginStatus:function(response){
					if (response.status === 'connected') {
					    // connected
					    this.set('isLoggedIn', true);
					  } else if (response.status === 'not_authorized') {
					    // not_authorized
					    //this.doLogin();
					  } else {
					    // not_logged_in
					    //this.doLogin();
					  }
				},

				doLogin:function(){
					FB.login($.proxy(this.onFBLogin, this));
				},

				onFBLogin:function(response){
					if (response.authResponse) {
			            // connected
			            this.set('isLoggedIn', true);
			        } else {
			            // cancelled
			        }
				},

				getLastSongs:function(){
					FB.api('me?fields=friends.fields(music.listens.fields(id, from, publish_time, application, data).limit(5))', $.proxy(this.onLastSongs, this));

				},

				onLastSongs:function(response){
					var friends = response.friends.data;
					var l_friends = friends.length;
					var last_songs = [];

					var l_songs = 0;
					var friends_songs = null;
					for (var i = l_friends - 1; i >= 0; i--) {

						friends_songs =friends[i]["music.listens"]?friends[i]["music.listens"].data:null;
						if(!friends_songs){continue;} // break if no songs
						l_songs = friends_songs.length;
						for (var j = 0; j < l_songs; j++) {
							last_songs.push(friends_songs[j]);
						};
					}
					this.set('last_songs', _.sortBy(last_songs, 'id'));
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
				
				
				events:{
					"click #fbLoginButton": "doLogin"
				},
				
				doLogin:function(){
					this.model.doLogin();
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
					this.listenTo(this.model.get('facebookProxy'), 'change:isLoggedIn', this.userLoginChange);
					this.model.get('facebookProxy').loadJDKAndInit();
					var isLoggedIn = this.model.get('facebookProxy').get('isLoggedIn');
					console.log(isLoggedIn);
					var loaderView = new FDJ.Views.LoaderView().$el;
					var loginView = new FDJ.Views.LoginView({ model: this.model.get('facebookProxy') } ).$el;
					var playerView = new FDJ.Views.PlayerView().$el;
					var debugView = new FDJ.Views.DebugPanel().$el;
					/*
					if(isLoggedIn){
						this.transitionTo(playerView);
					}else{
						this.transitionTo(loginView);
					}
					*/
					
					this.$el.append(new FDJ.Views.LoaderView().$el);
					this.$el.append(new FDJ.Views.DebugPanel().$el);
				
				},
				
				userLoginChange:function(){
					var isLoggedIn = this.model.get('facebookProxy').get('isLoggedIn');
					console.log(isLoggedIn);
					if(isLoggedIn){
						this.transitionTo(this.playerView);
					}else{
						this.transitionTo(this.loginView);
					}
					
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