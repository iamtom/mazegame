<!DOCTYPE html>
 
<html>
	<head>
		<title>Stay On Track</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>	
		<script type="text/javascript" src="mazes.js"></script>	
		<script type="text/javascript" src="mazegame.js"></script>
		<link type="text/css" rel="stylesheet" href="stylesheet.css"/>
	</head>
 
	<body>
		<div class="container">
			<!-- <div id="instructions">
				<p>The aim of the game is simple. Get from the start point (green square) to the end point (red square).</p>
				<p>To play, select the level you want from the selection under the game screen.</p>
				<p>As your mouse enters the green square the timer will start! It will not stop until your mouse reaches to red square so move as quickly as you can!</p>
				<p>But remember, DON'T TOUCH THE SIDES!</p>
			</div> -->
			<h1>Stay On Track</h1>
			<div id="startScreen" class="noSelect">
				<p>The aim of the game is simple. Get from the start point (green square) to the end point (red square). The only problem is that if your mouse wanders off the track then it's game over!</p>
				<p>To play, select the level you want from the selection under the game screen.</p>
				<p>As your mouse enters the green square the timer will start! It will not stop until your mouse reaches to red square so move as quickly as you can!</p>
				<p>Good luck!</p>
			</div>
			<div id="levelCompleteScreen" class="noSelect">
				
				<form id="scoreForm" action="process_score.php" method="POST">
					<h1>Winner!</h1>
					<h2>You did it in <span id="playerTimeDisplay"></span> seconds!</h2>
					<h4>Submit your score?</h4>
					<input type="hidden" name="levelPlayed" id="levelPlayed">
					<input type="hidden" name="playerTime" id="playerTime">
					<input type="text" name="playerName" maxlength="12" value="Enter name">
					<input type="submit" name="formSubmit" value="Submit">
				</form>
			</div>
			<div id="gameOverScreen" class="noSelect">
				<h1>Game Over!</h1>
			</div>
			<canvas id="canvas" tabindex="0">
				<p>This app requires JavaScript. Please enable JavaScript.</p>
			</canvas>
			<div id="info">
				<div id="levelSelection" class="noSelect">
					<div id="startLevel1" class="startLevel button">Level 1</div>
					<div id="startLevel2" class="startLevel button">Level 2</div>
					<div id="startLevel3" class="startLevel button">Level 3</div>
					<div id="startLevel4" class="startLevel button">Level 4</div>
					<div id="startLevel5" class="startLevel button">Level 5</div>
					<div id="startLevel6" class="startLevel button">Level 6</div>
					<div id="startLevel7" class="startLevel button">Level 7</div>
					<div id="startLevel8" class="startLevel button">Level 8</div>
					<div id="startLevel9" class="startLevel button">Level 9</div>
					<div id="startLevel10" class="startLevel button">Level 10</div>
				</div>
				<div id="scores">
					<!--Player scores for each level here-->
				</div>
				<!-- <div id="timer">
					Timer here
					
				</div> -->
			</div>
		</div>
	</body>
</html>