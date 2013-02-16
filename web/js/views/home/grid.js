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