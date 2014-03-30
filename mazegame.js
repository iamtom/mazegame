$(document).ready(function() {
	var context = canvas.getContext("2d");
	canvas.width = 1000;
	canvas.height = 500;

	var oneUnit = canvas.height/20; //25

	var score = 0;
	var timerOn = false;
	var startTime;
	var endTime;
	var floorColour;
	var wallColour;
	var startColour;
	var endColour;

	//Line style
	context.lineCap = 'round';
	context.lineJoin = 'round';
	context.lineWidth = 1;
	context.strokeStyle = 'black';	

	//Level completition will be timed. Should start from when the mouse leaves the green until it enters the red.

	//If the player touches the wall they die. This stops them just rushing through and bouncing off the walls to get the best score

	//HARD MODE: A black screen covers the maze. There is a circle of visibility surrounding the players mouse. This is another canvas on top of the bottom one. The circle is completely see-through
	//Mouse
	function getMousePosition(canvas, event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}	
	function unbindMouse() {
		$('#canvas').unbind('mousemove');
		logOfX = [];
		logOfY = [];
	}

	//Collision
	function collisionDetect(playerX, playerY) {
		var checkColour;
		playerBox = context.getImageData(playerX, playerY, 1, 1);

		// console.log(playerBox);
		// console.log(wallColour);
		for (i = 0; i < playerBox.data.length; i+4){
			checkColour = 'rgb(' + playerBox.data[i] + ',' + playerBox.data[i+1] + ',' + playerBox.data[i+2] + ')';
			break;
		}
		if (checkColour == wallColour) {
			console.log('you died!');
			//display game over screen
			timerStop();				
			gameOver();
		} else if (checkColour == endColour /*&& timerOn == true*/) {
			//display win screen and stop timer
			timerStop();
			levelComplete();
		} else if (checkColour == startColour /*&& timerOn == false*/) {
			//Start the timer
			timerStart();
		}
	}


	//Level construction
	function drawMaze(level, levelData) {
		pX = 0; 
		pY =0;
		//draw the maze based on what level is called. 0 = white/empty, 1 = grey/wall, 2 = green/start, 3 = red/end
		floorColour = 'rgb(' + levelData.floor[0] + ',' + levelData.floor[1] + ',' + levelData.floor[2] + ')';
		wallColour = 'rgb(' + levelData.wall[0] + ',' + levelData.wall[1] + ',' + levelData.wall[2] + ')';
		startColour = 'rgb(' + levelData.start[0] + ',' + levelData.start[1] + ',' + levelData.start[2] + ')';
		endColour = 'rgb(' + levelData.end[0] + ',' + levelData.end[1] + ',' + levelData.end[2] + ')';

		for (i = 0; i < level.length; i++) {
			//Go through each row in the array
			for (j = 0; j < level[i].length; j++) {
				//Go through the row and draw by numbers
				typeOfBlock = level[i][j]
				drawBlock(typeOfBlock);
				pX += oneUnit;
			}
			pX = 0;
			pY += oneUnit;
		}
	}
	function drawBlock(typeOf) {
		var blockColour = 'pink';
		switch(typeOf) {
			case 0:
				//draw floor
				blockColour = floorColour;
				break;
			case 1:
				//draw walls
				blockColour = wallColour;
				break;
			case 2:
				//draw start
				blockColour = startColour;
				break;
			case 3:
				//draw end
				blockColour = endColour;
				break;
			default:
				break;
		}
		context.fillStyle = blockColour;
		context.fillRect(pX, pY, oneUnit, oneUnit);
	}

	//Timer
	function timerStart() {
		//Start the timer
		timerOn = true;
		startTime = new Date();
	}
	function timerStop() {
		//stop timer
		//score = time
		//write score to object containing player times for each level
		timerOn = false;
		endTime = new Date();	
	}

	function startLevel(level, levelData) {
		//load level and appropriate level data
		$('#startScreen').css('visibility', 'hidden');
		$('#levelCompleteScreen').css('visibility', 'hidden');
		$('#gameOverScreen').css('visibility', 'hidden');
		$('#levelSelection').css('visibility', 'hidden');
		drawMaze(level, levelData);
	}
	function levelComplete() {
		//End timer
		//show level complete screen
		unbindMouse();
		$('#levelCompleteScreen').css('visibility', 'visible');
		//display time/score
		$('#levelSelection').css('visibility', 'visible');
		var playerTime = (endTime.getTime() - startTime.getTime())/1000;
		$('#levelCompleteScreen').html('<h1>Winner!</h1><h2>Your time: ' + playerTime + ' seconds</h2>');
	}		
	function gameOver() {
		//End timer
		//Show game over screen
		unbindMouse();
		$('#gameOverScreen').css('visibility', 'visible');
		$('#levelSelection').css('visibility', 'visible');
	}
	


	//Level selection buttons
	$('#startLevel1').click(function() {
		startLevel(map1, map1Data);
	});
	$('#startLevel2').click(function() {
		startLevel(map2, map2Data);
	});
	$('#startLevel3').click(function() {
		startLevel(map3, map3Data);
	});

	//Drawing with the mouse
	$('#canvas').mouseenter(function(event) {
		var logOfX = [];
		var logOfY = [];
		pos = getMousePosition(canvas, event);
		posX = pos.x;
		posY = pos.y;
				
		context.beginPath();
		logOfX.push(posX);
		logOfY.push(posY);
		$('#canvas').mousemove(function(event) {
			pos = getMousePosition(canvas, event);
			posX = pos.x;
			posY = pos.y;
			/* //Just so I can see the co-ordinates in the console:
			var msg = "Mouse called at ";
			msg += event.pageX + ", " + event.pageY;
			console.log(msg); */

			collisionDetect(posX, posY);

			//Draw the lines:
			context.moveTo(logOfX[logOfX.length], logOfY[logOfY.length]);
			context.lineTo(posX, posY);
			context.stroke();			

			if (logOfX.length && logOfY.length > 10) {
				logOfX = [];
				logOfY = [];
			}
		
		});
	});


	
	

});