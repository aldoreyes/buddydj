	FDJ.Models.Song = Backbone.Model.extend({
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
