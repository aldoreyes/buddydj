var FDJ = {
	Models : null,
	Collections : null,
	Views: null,

	initFramework : function(){
		if(!this.Models){
			this.Models = {};
			this.Views = {};
			this.Collections = {};

			//error status definitions
			NO_ERROR = "noError";
			USER_LOGGEDOUT = "userLoggedOut";
			CONNECTION_LOST = "connectionLost";
			UNKNOWN_ERROR = "unknownError";

