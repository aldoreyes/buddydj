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
		}
	},

	initApp:function(){
		window.model = new FDJ.Models.MainModel();
		window.view = new FDJ.Views.MainView({model:window.model});
	}

};

$(function(){
	FDJ.initFramework();

	FDJ.initApp();
});