<!DOCTYPE html>
<html>
	<head>
		<title>BuddyDJ</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
		<!-- Bootstrap -->
		<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
		<link href="css/main.css" rel="stylesheet" media="screen">
	</head>
	<body>
		<?php

    // connect to MongoHQ assuming your MONGOHQ_URL environment
    // variable contains the connection string
    $connection_url = getenv("mongodb://fdjdb:49ikk29s8@linus.mongohq.com:10048/app11333631");
 
    // create the mongo connection object
    $m = new Mongo($connection_url);
 
    // extract the DB name from the connection path
    $url = parse_url($connection_url);
    $db_name = preg_replace('/\/(.*)/', '$1', $url['path']);
 
    // use the database we connected to
    $db = $m->selectDB($db_name);
 
    echo "<h2>Collections</h2>";
    echo "<ul>";
 
    // print out list of collections
    $cursor = $db->listCollections();
    $collection_name = "";
    foreach( $cursor as $doc ) {
      echo "<li>" .  $doc->getName() . "</li>";
      $collection_name = $doc->getName();
    }
    echo "</ul>";
 
    // print out last collection
    if ( $collection_name != "" ) {
      $collection = $db->selectCollection($collection_name);
      echo "<h2>Documents in ${collection_name}</h2>";
 
      // only print out the first 5 docs
      $cursor = $collection->find();
      $cursor->limit(5);
      echo $cursor->count() . ' document(s) found. <br/>';
      foreach( $cursor as $doc ) {
        echo "<pre>";
        var_dump($doc);
        echo "</pre>";
      }
    }
 
    // disconnect from server
    $m->close();
?>
		<!--
		***************************************
		***** Main Container: Where the magic happens
		***************************************
		-->
		<div id="main-container"></div>
		<!--
		***************************************
		***** Debug Panel
		***************************************
		-->
		<div id="debugpanel">
			Debug Panel: 2
			<br>
			<a id="debug-login-button" href="#">User Login</a>
			<br>
			<a id="debug-logout-button" href="#">User Logout</a>
			<br>
			<a id="debug-add-song" href="#">Add Song</a>
			<br>
			<a id="debug-change-fbname" href="#">Change FB Name</a>
			<br>
			<a id="debug-fb-logout" href="#">FB Logout</a>
			<br>
			<a id="debug-connectionloss" href="#">Connection Loss</a>
			<br>
			<a id="debug-lamefriends" href="#">Lame Friends</a>
		</div>
		<!--
		***************************************
		***** Template: Main Loader
		***************************************
		-->
		<script type="text/template" id="loader-template">
			<img class="loader-indicator" src="/img/loader.gif" border="0">
		</script>

		<!--
		***************************************
		***** Template: Login Screen
		***************************************
		-->
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
		<!--
		***************************************
		***** Template: Home (Contains Header, Grid, Player, Footer)
		***************************************
		-->
		<script type="text/template" id="home-template">
			<div class="navbar navbar-inverse navbar-fixed-top">
				<div id="header" class="navbar-inner">
			        <div class="container-fluid">
						<a class="brand" href="#">Facebook DJ</a>
						<div class="nav-collapse collapse">
							<p id="fbInfoViewEl" class="navbar-text pull-right"></p>
						</div>
						<div class="nav-collapse collapse">
							<p class="navbar-text">
								<p class="pull-left text-warning">
									<img src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc6/275957_7000452_1026323116_q.jpg" width="25" height="25"/>
									Currently playing: Whatever by Foo Fighter
								</p>
								<p class="pull-left text-warning">
									<button class="btn btn-mini" type="button">Play</button>
									<button class="btn btn-mini" type="button">Stop</button>
									<button class="btn btn-mini" type="button">Skip</button>
								</p>
				            </p>
						</div>
			        </div>	
			    </div>
			</div>
			<div id="gridViewEl"></div>
			<div class="navbar navbar-inverse navbar-fixed-bottom">
			    <div class="navbar-inner">
			        <div class="container-fluid">
						<div class="nav-collapse collapse">
							<p class="navbar-text pull-right">
								Made by Aldo & Matias
							</p>
						</div>
			        </div>
				</div>
			</div>
			<div id="modalViewEl"></div>
		</script>
		<!--
		***************************************
		***** Template: Tile (Song)
		***************************************
		-->
		<script type="text/template" id="tile-template">
			<p><%= data.song.title  %></p>
			<p><%= artist  %></p>
			<p><img src="http://graph.facebook.com/<%= from.id %>/picture" width="25" height="25" border="0"> <%= from.name  %></p>
			<p>Time:<%= publish_time  %></p>
			<p>Number:<%= itemIndex  %></p>
		</script>
		<!--
		***************************************
		***** Template: Facebook Info Div (Header)
		***************************************
		-->
		<script type="text/template" id="fbinfo-template">
			<% if(fbUser) { %><img src="http://graph.facebook.com/<%= fbUser.id %>/picture" width="25" height="25" border="0"> Hello <%= fbUser.name %><% } %>! <button class="btn btn-mini" type="button" id="fbLogoutButton">Log Out</button>
		</script>
		<!--
		***************************************
		***** Template: Grid (contains songs)
		***************************************
		-->
		<script type="text/template" id="grid-template">
			<div id="grid-loader" class="loader-indicator" >
				<img  src="/img/loader.gif" border="0">
				<p>Loading Songs</p> 
			</div>
			<div id="wrapper">
				<div id="container" class="clearfix"></div>
			</div>
			<div id="noSongsViewEl"></div>
		</script>
		<!--
		***************************************
		***** Template: Logged Out Modal Dialog
		***************************************
		-->
		<script type="text/template" id="loggedout-template">
			<div class="modal" id="dialog">
				<div class="container-narrow">
					<div class="jumbotron">
				        <h1>Ooops!</h1>
				        <p class="lead">Looks like you have been logged out.</p>
				        <a class="btn btn-primary btn-large" href="#" id="fbReLoginButton">Sign in with Facebook</a>
				      </div>
				</div>
			</div>
			<div id="modal-overlay"></div>
		</script>
		<!--
		***************************************
		***** Template: Lost Connection Modal Dialog
		***************************************
		-->
		<script type="text/template" id="noconnection-template">
			<div class="modal" id="dialog">
				<div class="container-narrow">
					<div class="jumbotron">
				        <h1>Ooops!</h1>
				        <p class="lead">Looks like you lost the internets!</p>
				        <p class="lead">You can <a class="btn btn-primary btn-small" href="#" id="ignore">ignore</a> or try again later.</p>
				      </div>
				</div>
			</div>
			<div id="modal-overlay"></div>
		</script>
		<!--
		***************************************
		***** Template: No Songs Message (In Grid)
		***************************************
		-->
		<script type="text/template" id="nosongs-template">
			<div class="container-narrow">
				<div class="jumbotron">
			        <h1>Oh No!</h1>
			        <p class="lead">Looks like your friends are not rocking!</p>
			        <p class="lead">Comeback later.</p>
			    </div>
			</div>
		</script>
		<!--
		***************************************
		***** JS Includes
		***************************************
		-->
		<script src="js/libs/jquery.min.js"></script>
		<script src="js/libs/bootstrap.min.js"></script>
		<script src="js/libs/underscore-min.js"></script>
		<script src="js/libs/backbone-min.js"></script>
		<script src="js/libs/jquery.isotope.min.js"></script>
		<script src="js/app.min.js"></script>

	</body>
</html>