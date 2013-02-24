FDJ.Models.MainModel = Backbone.Model.extend({
				initialize:function(){
					this.set('facebookProxy', new FDJ.Models.FacebookProxy({app_id:'480004502036911', channel:'/channel.php'}));
					this.set('youtubeProxy', new FDJ.Models.YoutubeProxy());
					
					this.set('current_queue', new FDJ.Collections.Queue());
					this.get('current_queue').comparator = this.DCSortBy;
					this.set('current_view',null);
					this.set('main_view',null);
					

					this.listenTo(this.get('facebookProxy'), 'change:last_songs', this.onLastSongsChange);
					this.listenTo(this, 'LastSongsChanged', this.autoplay);
					this.listenTo(this.get('current_queue'), 'add', this.autoFetchSong);
					
				},

				onLastSongsChange:function(){
					this.get('current_queue').update(this.get('facebookProxy').get('last_songs').models, {remove:false});
					this.trigger('LastSongsChanged');
				},

				autoFetchSong:function(song){
					song.fetch();
				},

				DCSortBy:function(song){
					return -song.get('publish_time_mili');
				},

				/**
				 * Internal function, dont call this outside
				 * @return {[type]} [description]
				 */
				autoplay:function(){
					this.stopListening(this, "LastSongsChanged");
					this.playNext();
				},

				playNext:function(){
					var currentSong = this.get('current_song');
					if(this.has('current_song')){
						this.get('current_song').set('played', true);
					}

					currentSong = this.get('current_queue').find(function(song){
						return !song.has('played') || !song.get('player');
					});

					this.set('current_song', currentSong);
					if(current_song.has('videoId')){
						this.get('youtubeProxy').play(currentSong);
					}else{
						this.listenTo(currentSong, "change:videoId", this.playOnSongLoad);
					}
					
				},

				playOnSongLoad:function(){
					this.stopListening(this.get("current_song"), "change:videoId");
					this.get('youtubeProxy').play(this.get("current_song"));
				}
			});