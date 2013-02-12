this.Views.DebugPanel = Backbone.View.extend({
				
				el:$("#debugpanel"),
				
				
				events:{
					"click #debug-login-button": "doDebugLogin",
					"click #debug-logout-button": "doDebugLogout",
					"click #debug-add-song": "doDebugAddSong",
					"click #debug-change-fbname": "doDebugChangeFbName"
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
					
				}
			


				
			});