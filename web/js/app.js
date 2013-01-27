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
					FB.api('/me?fields=friends.fields(music.listens.limit(5))', $.proxy(this.onLastSongs, this));

				},

				onLastSongs:function(response){
					//response.friends.data
					//this.set('last_songs', )
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

			this.Views.MainView = Backbone.View.extend({
				el:$("#main-container"),

				initialize:function(){
					console.log(this.$el);
					this.model.get('facebookProxy').loadJDKAndInit();
					this.$el.append(new FDJ.Views.LoginView().$el);
				},

				
			});

			this.Views.DebugPanel = Backbone.View.extend({
				el:$("#debugpanel"),

				events:{
					"click #debug-login-button": "doDebugLogin"
				},

				doDebugLogin:function(){
					console.log("doDebugLogin");
				},


				initialize:function(){

				}
			});
		}
	},

	initApp:function(){
		window.model = new FDJ.Models.MainModel();
		window.view = new FDJ.Views.MainView({model:window.model});
		window.debug = new FDJ.Views.DebugPanel({model:window.model});
	}

};

$(function(){
	FDJ.initFramework();

	FDJ.initApp();
});