FDJ.Views.DebugPanel = Backbone.View.extend({
				
				el:$("#debugpanel"),
				
				
				events:{
					"click #debug-login-button": "doDebugLogin",
					"click #debug-logout-button": "doDebugLogout",
					"click #debug-add-song": "doDebugAddSong",
					"click #debug-change-fbname": "doDebugChangeFbName",
					"click #debug-fb-logout": "doDebugFBLogout",
					"click #debug-connectionloss": "doDebugConnectionLoss",
					"click #debug-lamefriends": "doDebugLameFriends"
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
					
					
					var fake_song =  this.model.get("facebookProxy").get('debug_fake_song');
					
					var rid = Math.floor((Math.random()*10000)+1000);
					fake_song.cid="c"+ rid;
					fake_song.id= fake_song.id +"" +  rid;
					fake_song.publish_time = new Date().toISOString();
	
					this.model.get("current_queue").add(new FDJ.Models.Song(fake_song));

					event.preventDefault();

					console.log("deDebugAddSong");

				},

				doDebugChangeFbName:function(){
					event.preventDefault();
					
					this.model.get("facebookProxy").set('fbUser', {name:"Joe Debug",id:"12302336"});
					console.log("doDebugChangeFbName");
					
				},
				doDebugFBLogout:function(){
					event.preventDefault();
					this.model.get('facebookProxy').set('statusError', FDJ.Models.FacebookProxy.USER_LOGGEDOUT);
					console.log("doDebugFBLogout");
				},
				
				doDebugConnectionLoss:function(){
					event.preventDefault();
					this.model.get('facebookProxy').set('statusError', FDJ.Models.FacebookProxy.CONNECTION_LOST);
					console.log("doDebugConnectionLoss");
				},

				doDebugLameFriends:function(){
					event.preventDefault();
					$('#container').html("");
					$('#container').height(0);
					$('#noSongsViewEl').html(new FDJ.Views.NoSongsView().$el);
					console.log("doDebugLameFriends");
				},

				
			});