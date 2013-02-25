FDJ.Views.MainView = Backbone.View.extend({
				el:$("#main-container"),

				initialize:function(){
					//console.log(this.$el);
					this.model.set('main_view',this);
					this.listenTo(this.model.get('facebookProxy'), 'change:isLoggedIn', this.userLoginChange);
					this.model.get('facebookProxy').loadJDKAndInit();
					
						
					var isLoggedIn = this.model.get('facebookProxy').get('isLoggedIn');
				

					//this.loaderView = new FDJ.Views.LoaderView();
					//this.loginView = new FDJ.Views.LoginView({ model: this.model.get('facebookProxy') } );
					//this.HomeView = new FDJ.Views.HomeView({ model: this.model.get('facebookProxy') } );
					
					if(isLoggedIn){
						this.transitionTo(new FDJ.Views.HomeView({ model: this.model } ));
					}
					
					this.$el.html(new FDJ.Views.LoaderView({ model: this.model }).$el);
					this.$el.append(new FDJ.Views.YTPlayer({model:this.model.get('youtubeProxy')}).$el);
					this.model.get('youtubeProxy').loadAndInit();
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
					this.model.get("main_view").$el.append(view.$el);
					
					
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
					
				}

				
			});