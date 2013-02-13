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