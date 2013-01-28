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
					this.listenTo(this.get('facebookProxy'), 'change:last_songs', this.onLastSongsChange);
					this.set('current_queue', new FDJ.Collections.Queue());
					this.get('current_queue').comparator = this.DCSortBy;
					
				},

				onLastSongsChange:function(){
					this.get('current_queue').update(this.get('facebookProxy').get('last_songs').models, {remove:false});
				},

				DCSortBy:function(song){
					return -song.get('publish_time_mili');
				}
			});

			this.Models.FacebookProxy = Backbone.Model.extend({
				initialize:function(){
					this.listenTo(this, 'change:isLoggedIn', this.onIsLoggedInChange);
				},

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
					console.log("Got FB Status");
					if (response.status === 'connected') {
					    // connected
					    this.set('isLoggedIn', true);
					  } else if (response.status === 'not_authorized') {
						this.set('isLoggedIn', false);
					    // not_authorized
					    //this.doLogin();
					  } else {
						this.set('isLoggedIn', false);
					    // not_logged_in
					    //this.doLogin();
					  }
				},

				doLogin:function(){
					FB.login($.proxy(this.onFBLogin, this));
				},
				
				doLogout:function(){
					FB.logout();
					this.set('isLoggedIn', false);
				},

				onFBLogin:function(response){
					if (response.authResponse) {
			            // connected
			            this.set('isLoggedIn', true);
			        } else {
			            // cancelled
			        }
				},

				onIsLoggedInChange:function(){
					if(this.get('isLoggedIn')){
						this.getLastSongsInterval();
					}else{
						clearInterval(this.get('interval_songs'));
					}
				},

				getLastSongsInterval:function(){
					this.getLastSongs();
					this.set('interval_songs', setInterval($.proxy(this.getLastSongs, this), 60*1000));
				},

				getLastSongs:function(){
					FB.api('/me?fields=friends.fields(music.listens.fields(id,from,publish_time,application,data).limit(5))', $.proxy(this.onLastSongs, this));

				},

				onLastSongs:function(response){
					console.log("get songs");
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
					
					this.set('last_songs', new FDJ.Collections.Queue(last_songs));
				}				
			});

			this.Models.Song = Backbone.Model.extend({
				initialize:function(){
					this.set('publish_time_mili', Date.parse(this.get('publish_time')));
				}
			});


			/*****************
			*** COLLECTIONS
			******************/
			this.Collections.Queue = Backbone.Collection.extend({
				model:FDJ.Models.Song
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
					console.log("loader init");
					this.render();
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				},
				
				reInit:function(){
					
				}
			});
			

			this.Views.LoginView = Backbone.View.extend({
				className:"panel",
				template: _.template($('#login-template').html()),

				initialize:function(){
					console.log("login init");
					this.render();
				},
				
				
				events:{
					"click #fbLoginButton": "doLogin"
				},
				
				doLogin:function(){
					event.preventDefault();
					this.model.doLogin();
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				},

				reInit:function(){
					console.log("login re-init");
				}
			});

			this.Views.TileView = Backbone.View.extend({
				template: _.template($('#tile-template').html()),
				className: 'song',

				render:function(){
					this.$el.html(this.template(this.model.attributes));
					this.$el.attr('data-symbol', this.model.get('publish_time_mili'));
					return this;
				}
			});
			
			this.Views.PlayerView = Backbone.View.extend({
				id:"player",
				template: _.template($('#player-template').html()),

				initialize:function(){
					this.listenTo(this.model.get('current_queue'), 'add', this.addSong);
				
					this.render();
					
					
				},
				
				events:{
					"click #fbLogoutButton": "doLogout"
				},
				
				addSong:function(grr){
					var $container = this.$('#container');
					var newElement = new FDJ.Views.TileView({model:grr});
		        	
		        	$container.prepend( newElement.render().$el ).isotope('reloadItems').isotope({ sortBy: 'original-order' })
		          	// set sort back to symbol for inserting
		          	.isotope('option', { sortBy: 'symbol' });
				},
				
				doLogout:function(){
					this.model.get("facebookProxy").doLogout();
				},
				
				reInit:function(){
					var $container = $('#container');
					
					$container.isotope({
		        		itemSelector : '.song',
		        		filter: '*',
		        		getSortData : {
		          			symbol : function( $elem ) {
		            			return $elem.attr('data-symbol');
		          			}
		        		},
		        		sortBy : 'symbol'
		      		});
					
					//console.log(this.$('#header').height());
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
				
					//this.loaderView = new FDJ.Views.LoaderView();
					//this.loginView = new FDJ.Views.LoginView({ model: this.model.get('facebookProxy') } );
					//this.playerView = new FDJ.Views.PlayerView({ model: this.model.get('facebookProxy') } );
					
					if(isLoggedIn){
						this.transitionTo(new FDJ.Views.PlayerView({ model: this.model } ));
					}
					
					this.$el.append(new FDJ.Views.LoaderView().$el);
					
				
				},
				
				userLoginChange:function(){
					var isLoggedIn = this.model.get('facebookProxy').get('isLoggedIn');

					if(isLoggedIn){
						
						this.transitionTo(new FDJ.Views.PlayerView({ model: this.model}));
					}else{
						this.transitionTo(new FDJ.Views.LoginView({ model: this.model.get('facebookProxy') } ));
					}
					
				},
				
				transitionTo:function(view){
					//console.log(view.$el.html());
					
					var obj = this.$el;
					var t = this;

						
					obj.html(view.$el);
					t.$('#wrapper').attr('style', 'margin-top:' + t.$('#header').height() + "px");
					view.reInit();
					/*
					 obj.fadeTo(500, 0,function(){
							console.log("finished dimming down");
							obj.html(view.$el);
							faded = true;
					        obj.fadeTo(500,1,function(){
							
							
								console.log("finished dimming UP");
								//TO DO!! change this to media queries...getto hack for now
								t.$('#wrapper').attr('style', 'margin-top:' + t.$('#header').height() + "px");
								view.reInit();
								
						
							});
					    });	
					
					 */
					
				}

				
			});

			this.Views.DebugPanel = Backbone.View.extend({
				
				el:$("#debugpanel"),
				
				
				events:{
					"click #debug-login-button": "doDebugLogin",
					"click #debug-logout-button": "doDebugLogout",
					"click #debug-add-song": "doDebugAddSong"
				},
				initialize:function(){
				
					console.log("Debug Panel Initialized");
				},
				doDebugLogin:function(){
					event.preventDefault();
					this.model.get('facebookProxy').doLogin();
					console.log("doDebugLogin");
				},
				
				doDebugLogout:function(){
					event.preventDefault();
					this.model.get('facebookProxy').doLogout();
					console.log("doDebugLogout");
				},

				doDebugAddSong:function(){
					event.preventDefault();
				
		   			window.view.playerView.addSong();
			
					console.log("deDebugAddSong");
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