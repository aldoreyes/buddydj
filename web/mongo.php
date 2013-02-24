<!-- PHP Mongo Docs: http://php.net/manual/en/class.mongodb.php -->
<html>
<body>
<?php
  try {

    $SONG_ID = $_GET['sId'];
    $SONG_NAME = $_GET['sName'];

    $songReturn = array();

    // connect to MongoHQ assuming your MONGOHQ_URL environment
    // variable contains the connection string
    $connection_url = "mongodb://fdjdb:49ikk29s8@linus.mongohq.com:10048/app11333631";
 
    // create the mongo connection object
    $m = new Mongo($connection_url);
 
    // extract the DB name from the connection path
    $url = parse_url($connection_url);
    $db_name = preg_replace('/\/(.*)/', '$1', $url['path']);
 
    // use the database we connected to
    $db = $m->selectDB($db_name);

    //$song = array('songId'=>2,'songName'=>'another song');
    //$db->cached_yt_songs->save($song);


    $now = new MongoDate(time());
    $cacheDate = new MongoDate(strtotime ( '-3 day' , time()));



    $cachedSong = $db->cached_yt_songs->findOne(array('songId' => $SONG_ID, "created_on" => array('$gt' => $cacheDate , '$lte' => $now)));
   
    
    if ($cachedSong==null){
      //song not in DB go to YOUTUBE and get info
      $song = array('songId'=>$SONG_ID,'songName'=> $SONG_NAME, "created_on" => $now);
      $db->cached_yt_songs->update( array('songId'=> $SONG_ID),$song, array("upsert"=> true));
      //echo("song not found, went to youtube, saved song");
      //print_r($song);
      $songReturn['result']="new";
      $songReturn['song']=$song;
     

    }else{
      $songReturn['result']="cached";
      $songReturn['song']=$cachedSong;
      
      //echo("found song in db already");
      //print_r($cachedSong);
    }



    echo(json_encode($songReturn));
 /*
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
 */
    // disconnect from server
    $m->close();
  } catch ( MongoConnectionException $e ) {
    die('Error connecting to MongoDB server');
  } catch ( MongoException $e ) {
    die('Mongo Error: ' . $e->getMessage());
  } catch ( Exception $e ) {
    die('Error: ' . $e->getMessage());
  }
?>
</body>
</html>