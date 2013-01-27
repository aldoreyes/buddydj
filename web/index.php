<!DOCTYPE html>
<html>
<head>
  <title>Bootstrap 101 Template</title>
  <!-- Bootstrap -->
  <link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
<link href="css/main.css" rel="stylesheet" media="screen">
</head>
<body>
<div id="main-container">
</div>
<div class="panel" id="player">
	this is the player div!
</div>

<div id="debugpanel">
	Debug Panel: Change!! my Feature!
	<br>
	<a id="debug-login-button" href="#">onUserLogin()</a>
	<br>
	<a href="#" onClick="javascript:onUserLogout();">onUserLogout()</a>
<div> 

<script type="text/template" id="login-template">
	<div class="container-narrow">

		<div class="masthead">
			<h3 class="muted">Facebook DJ</h3>
		</div>

		<hr>

		<div class="jumbotron">
	        <h1>What are your friends jamming to?</h1>
	        <p class="lead">Let your friends be the DJ. Facebook DJ will play what your friends are listening to in real-time.</p>
	        <a class="btn btn-primary btn-large" href="#">Sign in with Facebook</a>
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

	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/libs/jquery.min.js"></script>
	<script src="js/libs/underscore-min.js"></script>
	<script src="js/libs/backbone-min.js"></script>
	<script src="js/app.js"></script>
</body>
</html>