<!DOCTYPE html>
<html>
<head>
  <title>BuddyDJ</title>
  <!-- Bootstrap -->
  <link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
<link href="css/main.css" rel="stylesheet" media="screen">
</head>
<body>
<div id="main-container"></div>
<div id="debugpanel">
	Debug Panel: 2
	<br>
	<a id="debug-login-button" href="#">User Login</a>
	<br>
	<a id="debug-logout-button" href="#">User Logout</a>
	<br>
	<a id="debug-add-song" href="#">Add Song</a>
</div>

<script type="text/template" id="loader-template">
Loader!
</script>
<script type="text/template" id="login-template">
	<div class="container-narrow">

		<div class="masthead">
			<h3 class="muted">Facebook DJ</h3>
		</div>

		<hr>

		<div class="jumbotron">
	        <h1>What are your friends jamming to?</h1>
	        <p class="lead">Let your friends be the DJ. Facebook DJ will play what your friends are listening to in real-time.</p>
	        <a class="btn btn-primary btn-large" href="#" id="fbLoginButton">Sign in with Facebook</a>
	      </div>

	      <hr>
	      <div class="row-fluid marketing">
	        <div class="span6">
	          <h4>Subheading</h4>
	          <p>Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</p>
	        </div>

	        <div class="span6">
	          <h4>Subheading</h4>
	          <p>Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</p>
	        </div>
				</div>
	</div>
</script>

<script type="text/template" id="player-template">
<div  class="navbar navbar-inverse navbar-fixed-top">
      <div id="header" class="navbar-inner">
        <div class="container-fluid">
      
          <a class="brand" href="#">Facebook DJ</a>
          <div class="nav-collapse collapse">
            <p class="navbar-text pull-right">
              Hello Facebook User! <button class="btn btn-mini" type="button" id="fbLogoutButton">Log Out</button>
            </p>
          </div><!--/.nav-collapse -->
					<div class="nav-collapse collapse">
            <p class="navbar-text">
              <p class="pull-left text-warning"><img src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc6/275957_7000452_1026323116_q.jpg" width="25" height="25"/>Currently playing: Whatever by Foo Fighter</p>
							<p class="pull-left text-warning"><button class="btn btn-mini" type="button">Play</button><button class="btn btn-mini" type="button">Stop</button><button class="btn btn-mini" type="button">Skip</button></p>
            </p>
          </div><!--/.nav-collapse -->
    		
        </div>
      </div>
 </div>

<div id="wrapper">
	<div id="container" class="clearfix"></div>
</div>
<div class="navbar navbar-inverse navbar-fixed-bottom">
      <div class="navbar-inner">
        <div class="container-fluid">
          
          <div class="nav-collapse collapse">
            <p class="navbar-text pull-right">
              Made by Aldo & Matias
            </p>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>
</script>
<script type="text/template" id="tile-template">
	<p><%= data.song.title  %></p>
	<p><%= artist  %></p>
	<p><a class="btn btn-primary btn-large">Learn more »</a></p>

</script>

	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/libs/jquery.min.js"></script>
	<script src="js/libs/underscore-min.js"></script>
	<script src="js/libs/backbone-min.js"></script>
	<script src="js/app.js"></script>
	<script src="js/jquery.isotope.min.js"></script>
</body>
</html>