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