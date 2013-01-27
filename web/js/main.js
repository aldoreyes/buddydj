var isLoggedIn = true; //temporary
var home = null;
var player = null;

$(document).ready(function() {
	home = $('#home').html();
	player = $('#player').html();
	
	if(isLoggedIn){
		$('#main').html(player);
	}else{
		$('#main').html(home);
	}
	
	
});//end dom ready

function onUserLogin(){
	transitionTo(player);
}

function onUserLogout(){
	transitionTo(home);
}

function transitionTo(section){
	$('#main').fadeOut(500, function() {
	    $('#main').html(section);
		$('#main').fadeIn(500, function() {});
	});
}