this.Models.FacebookProxy = Backbone.Model.extend({
				initialize:function(){
					
					
					this.listenTo(this, 'change:isLoggedIn', this.onIsLoggedInChange);
					this.set('fbUser', null);
					this.set('isInitialSongGet', true);
					
			
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
					
					//console.log(last_songs.length);
					this.trigger('initialsongs', new FDJ.Collections.Queue(last_songs));
					this.set('last_songs', new FDJ.Collections.Queue(last_songs));
			
				}				
			});