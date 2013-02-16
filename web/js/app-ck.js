//--begin framework
//@codekit-append "appBegin.js";

//--models
//@codekit-append "models/main.js";
//@codekit-append "models/facebookProxy.js";
//@codekit-append "models/song.js";

//--collections
//@codekit-append "collections/queue.js";

//--views
//@codekit-append "views/main.js";
//@codekit-append "views/loader.js";
//@codekit-append "views/login.js";
//@codekit-append "views/home.js";
//@codekit-append "views/home/fbInfo.js";
//@codekit-append "views/home/grid.js";
//@codekit-append "views/home/grid/tile.js";
//@codekit-append "views/home/grid/noSongs.js";
//@codekit-append "views/modals/loggedOut.js";
//@codekit-append "views/modals/noConnection.js";
//@codekit-append "views/debug.js";

//--end framework
//@codekit-append "appEnd.js";

/* **********************************************
     Begin appBegin.js
********************************************** */

var FDJ = {
	Models : null,
	Collections : null,
	Views: null,

	initFramework : function(){
		if(!this.Models){
			this.Models = {};
			this.Views = {};
			this.Collections = {};

			//error status definitions
			NO_ERROR = "noError";
			USER_LOGGEDOUT = "userLoggedOut";
			CONNECTION_LOST = "connectionLost";
			UNKNOWN_ERROR = "unknownError";



/* **********************************************
     Begin main.js
********************************************** */

this.Models.MainModel = Backbone.Model.extend({
				initialize:function(){
					this.set('facebookProxy', new FDJ.Models.FacebookProxy({app_id:'480004502036911', channel:'/channel.php'}));
					this.listenTo(this.get('facebookProxy'), 'change:last_songs', this.onLastSongsChange);
					this.set('current_queue', new FDJ.Collections.Queue());
					this.get('current_queue').comparator = this.DCSortBy;
					this.set('current_view',null);
					this.set('main_view',null);
					
					this.set('debug_fake_song', null);
					
				},

				onLastSongsChange:function(){
					//console.log("detected change in last_songs");	
					//console.log(this.get('facebookProxy').get('last_songs').models);
					this.get('current_queue').update(this.get('facebookProxy').get('last_songs').models, {remove:false});
					
				},

				DCSortBy:function(song){
					return -song.get('publish_time_mili');
				}
			});

/* **********************************************
     Begin facebookProxy.js
********************************************** */

this.Models.FacebookProxy = Backbone.Model.extend({
				
				initialize:function(){
					
					this.listenTo(this, 'change:isLoggedIn', this.onIsLoggedInChange);
					this.set('fbUser', null);
					this.set('statusError', NO_ERROR);

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
					
					if (response.status === 'connected') {
					// connected
						this.set('isLoggedIn', true);
						this.getFBUser();
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

				doReLogin:function(){
					
					FB.login($.proxy(this.onFBReLogin, this));

				},
				
				doLogout:function(){
					
					FB.logout();
					this.set('isLoggedIn', false);
					this.set('fbUser', false);
					this.set('current_queue', null);

				},

				onFBLogin:function(response){
					
					if (response.authResponse) {
			            // connected
			            this.getFBUser();
			            this.set('isLoggedIn', true);

			        } else {
			            // cancelled
			        }
				},

				onFBReLogin:function(response){
					
					if (response.authResponse) {
						
						this.getLastSongsInterval();
			            this.set('statusError', NO_ERROR);
			            this.getFBUser();
			            
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
				
				getFBUser:function(){
					
					FB.api('/me', $.proxy(this.onFBUser, this));

				},
				
				onFBUser:function(response){
					
					this.set('fbUser', response);
				
				},

				getLastSongs:function(){
					
					FB.api('/me?fields=friends.fields(music.listens.fields(id,from,publish_time,application,data).limit(5))', $.proxy(this.onLastSongs, this));
					
				},
				
				
				onLastSongs:function(response){
			
					if(typeof response.friends !== 'undefined'){
						
						console.log("got data!");
					
						this.set('statusError', NO_ERROR);

						var friends = response.friends.data;
						var l_friends = friends.length;
						var last_songs = [];

						var songIndex =0;
						var l_songs = 0;
						var friends_songs = null;
						
						for (var i = l_friends - 1; i >= 0; i--) {
							
							friends_songs =friends[i]["music.listens"]?friends[i]["music.listens"].data:null;
							//console.log(friends_songs);
							if(!friends_songs){continue;} // break if no songs
							
							l_songs = friends_songs.length;
							
							for (var j = 0; j < l_songs; j++) {
								friends_songs[j].itemIndex = songIndex;
								last_songs.push(friends_songs[j]);
								songIndex++;

							};
						}

						//last_songs = null;
						//console.log(last_songs.length);
						this.trigger('initialsongs', new FDJ.Collections.Queue(last_songs));
						this.set('last_songs', new FDJ.Collections.Queue(last_songs));
					
					}else if(response.error){
						
						if(response.error.type=="http"){
							
							this.set('statusError', CONNECTION_LOST);

						}else if(response.error.type=="OAuthException"){					
							
							this.set('statusError', USER_LOGGEDOUT);
							clearInterval(this.get('interval_songs'));
							
						}else{
							
							console.log("other response error");

						}	
						
					}else{
						
						this.set('statusError', UNKNOWN_ERROR);
						
					}
			
				}	
							
			});

/* **********************************************
     Begin song.js
********************************************** */

	this.Models.Song = Backbone.Model.extend({
				initialize:function(){
					this.set('publish_time_mili', Date.parse(this.get('publish_time')));
					

					//create artist homogenous property
				
					switch(this.get('application').name){
					case "Spotify":
						var musician = this.get('data').musician;
						this.set('artist', musician?musician.title:"");
						break;
					case "Rdio":
						var groups = this.constructor.rdioParse(this.get('data').song.url);
						this.set('artist', groups[1].replace(/_/g, ' '));
						this.set('album', groups[2].replace(/_/g, ' '));
						break;
					default:
						this.set('artist','');
						break;
					}
				}
			},
			//STATIC
			{
				rdioParse:function(url){
					return /^.*artist\/(.+)\/album\/(.+)\/track\/.*/g.exec(url)
				}
			});


/* **********************************************
     Begin queue.js
********************************************** */

this.Collections.Queue = Backbone.Collection.extend({
	model:FDJ.Models.Song
});

/* **********************************************
     Begin main.js
********************************************** */

this.Views.MainView = Backbone.View.extend({
				el:$("#main-container"),

				initialize:function(){
					//console.log(this.$el);
					this.model.set('main_view',this);
					this.listenTo(this.model.get('facebookProxy'), 'change:isLoggedIn', this.userLoginChange);
					this.model.get('facebookProxy').loadJDKAndInit();
					this.render();
						
					var isLoggedIn = this.model.get('facebookProxy').get('isLoggedIn');
				
					//this.loaderView = new FDJ.Views.LoaderView();
					//this.loginView = new FDJ.Views.LoginView({ model: this.model.get('facebookProxy') } );
					//this.HomeView = new FDJ.Views.HomeView({ model: this.model.get('facebookProxy') } );
					
					if(isLoggedIn){
						this.transitionTo(new FDJ.Views.HomeView({ model: this.model } ));
					}
					
					this.$el.html(new FDJ.Views.LoaderView({ model: this.model }).$el);
				
				
				},
				
				userLoginChange:function(){
					var isLoggedIn = this.model.get('facebookProxy').get('isLoggedIn');

					if(isLoggedIn){
						this.transitionTo(new FDJ.Views.HomeView({ model: this.model}));
					}else{
						this.transitionTo(new FDJ.Views.LoginView({ model: this.model}));
					}
					
				},
				
				transitionTo:function(view){
					
					if(this.model.get("current_view")!=null){
						//console.log(this.model.get("current_view").$el);
						this.model.get("current_view").remove();
					} 
					
					this.model.set('current_view',view);
					this.model.get("main_view").$el.html(view.$el);
					
					
					/*
					var obj = this.$el;
					var t = this;

				
					obj.html(view.$el);
					t.$('#wrapper').attr('style', 'margin-top:' + t.$('#header').height() + "px");
					view.reInit();
					
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
					
				},
				
				render:function(){
					console.log("render main view");
					this.$el.html();
					return this;
				}

				
			});

/* **********************************************
     Begin loader.js
********************************************** */

this.Views.LoaderView = Backbone.View.extend({
				id:"loader",
				template: _.template($('#loader-template').html()),

				initialize:function(){
					this.model.set('current_view',this);
					console.log("loader init");
					this.render();
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});

/* **********************************************
     Begin login.js
********************************************** */

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

/* **********************************************
     Begin home.js
********************************************** */

this.Views.HomeView = Backbone.View.extend({
				
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

/* **********************************************
     Begin fbInfo.js
********************************************** */

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

/* **********************************************
     Begin grid.js
********************************************** */

this.Views.GridView = Backbone.View.extend({
				
				id:"grid",
				template: _.template($('#grid-template').html()),

				initialize:function(){
					
					console.log("init grid view");
					this.model.get("facebookProxy").bind('initialsongs', this.initialSongs, this);
					this.render();

				},

				initialSongs:function(songs){
					
					console.log("get initial song list!");
					
					this.model.get("facebookProxy").off("initialsongs");
					
					var $container = this.$('#container');
					
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

						if(songs.length!=0){
							
							for (var i=0;i<songs.models.length;i++)
							{ 
								
								var newElement = new FDJ.Views.TileView({model:songs.models[i]});
								this.model.set('debug_fake_song',songs.models[i]);
								$container.append( newElement.render().$el ).isotope( 'addItems', newElement.render().$el);
							}

						}else{

							console.log("friends are lame!");
							this.$('#noSongsViewEl').html(new FDJ.Views.NoSongsView().$el);

						}

						var thisView = this;

						setTimeout(function(){
							$container.isotope('reloadItems').isotope({ sortBy: 'symbol',sortAscending : false });
							thisView.$('#grid-loader').remove();
							thisView.listenTo(this.model.get('current_queue'), 'add', thisView.addSong);
						}, 1000);
						
						//this.listenTo(this.model.get('current_queue'), 'add', this.addSong);
						
				},

				addSong:function(newSong){		
					
					console.log("New Song Added!");
					console.log(newSong);

					var $container = this.$('#container');
					var newElement = new FDJ.Views.TileView({model:newSong});
		        	$container.prepend( newElement.render().$el ).isotope('reloadItems').isotope({ sortBy: 'symbol', sortAscending : false });
		          	
				},

				render:function(){
					
					this.$el.html(this.template());
					console.log("render grid view");
					return this;

				}
				
			});

/* **********************************************
     Begin tile.js
********************************************** */

this.Views.TileView = Backbone.View.extend({
	template: _.template($('#tile-template').html()),
	className: 'song',

	render:function(){
		this.$el.html(this.template(this.model.attributes));
		this.$el.attr('data-symbol', this.model.get('publish_time_mili'));
		return this;
	}
});

/* **********************************************
     Begin noSongs.js
********************************************** */

this.Views.NoSongsView = Backbone.View.extend({
				id:"nosongs",
				template: _.template($('#nosongs-template').html()),

				initialize:function(){
			
					this.render();
					console.log("no songs init");	
					
				},

				render:function(){
					this.$el.html(this.template());
					return this;
				}
			});

/* **********************************************
     Begin loggedOut.js
********************************************** */

this.Views.LoggedOutView = Backbone.View.extend({
				
				id:"loggedout",
				template: _.template($('#loggedout-template').html()),

				initialize:function(){
					
					this.render();
					console.log("logged out init");

					this.listenTo(this.model.get('facebookProxy'), 'change:statusError', this.onStatusError);
					
				},

				onStatusError:function(e){
					
					if(e.attributes.statusError == NO_ERROR){
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

/* **********************************************
     Begin noConnection.js
********************************************** */

this.Views.NoConnectionView = Backbone.View.extend({
				id:"noconnection",
				template: _.template($('#noconnection-template').html()),

				initialize:function(){
					
					
						
					this.render();
					console.log("no connection out init");


					this.listenTo(this.model.get('facebookProxy'), 'change:statusError', this.onStatusError);
					
					
						
					
				},

				onStatusError:function(e){
					if(e.attributes.statusError == NO_ERROR){
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

/* **********************************************
     Begin debug.js
********************************************** */

this.Views.DebugPanel = Backbone.View.extend({
				
				el:$("#debugpanel"),
				
				
				events:{
					"click #debug-login-button": "doDebugLogin",
					"click #debug-logout-button": "doDebugLogout",
					"click #debug-add-song": "doDebugAddSong",
					"click #debug-change-fbname": "doDebugChangeFbName",
					"click #debug-fake-logout": "doDebugFakeLogout"
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
					//this.model.onLastSongsChange();
		   			var $container = $('#container');
					var newElement = new FDJ.Views.TileView({model:this.model.get('debug_fake_song')});

		        	$container.prepend( newElement.render().$el ).isotope('reloadItems').isotope({ sortBy: 'original-order' })
		          	// set sort back to symbol for inserting
		          	//.isotope('option', { sortBy: 'symbol' });
					//$container.isotope('reloadItems').isotope({ sortBy: 'original-order' })
					          	// set sort back to symbol for inserting
					  //        	.isotope('option', { sortBy: 'symbol' })
					console.log("deDebugAddSong");
				},

				doDebugChangeFbName:function(){
					event.preventDefault();
					console.log("change fb name");
					//this.model.get("facebookProxy").get("fbUser").name="testing!";
					this.model.get("facebookProxy").set('fbUser', null);
					
				},
				doDebugFakeLogout:function(){
					event.preventDefault();
					this.model.get('facebookProxy').set('statusError', USER_LOGGEDOUT);
					console.log("doDebugFakeLogout");
				},
			


				
			});

/* **********************************************
     Begin appEnd.js
********************************************** */

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