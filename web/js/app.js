var FDJ = {
	Models : {},
	Collections : {},
	Views: {},

	initFramework : function(){

			//error status definitions
			

	},

	initApp:function(){
		window.model = new FDJ.Models.MainModel();
		window.view = new FDJ.Views.MainView({model:window.model});
		window.debug = new FDJ.Views.DebugPanel({model:window.model});
	},
};

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

$(function(){
	FDJ.initFramework();
	FDJ.initApp();
});