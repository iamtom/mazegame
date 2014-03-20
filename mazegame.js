$(document).ready(function() {
	var context = canvas.getContext("2d");
	canvas.width = 1000;
	canvas.height = 500;

	oneUnit = 25;

	//Should focus mouse to canvas here and place it in the start position

	//If mouse leaves canvas remember its last coordinates. When mouse re-enters move it to those co-ordinates

	//Level completition will be timed. Should start from when the mouse leaves the green until it enters the red.

	//If the player touches the wall they die. This stops them just rushing through and bouncing off the walls to get the best score

	//HARD MODE: A black screen covers the maze. There is a circle of visibility surrounding the players mouse. This is another canvas on top of the bottom one. The circle is completely see-through

	var pX = 0, pY =0;
	var logOfX = [];
	var logOfY = [];
	var score = 0;
	var floorColour;
	var wallColour;
	var startColour;
	var endColour;

	//Line style
	context.lineCap = 'round';
	context.lineJoin = 'round';
	context.lineWidth = 1;
	context.strokeStyle = 'black';

	//Mouse movement
	function getMousePosition(canvas, event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}	
	//Drawing with the mouse
	$('#canvas').mouseenter(function(event) {
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
	//Collision
	function collisionDetect(playerX, playerY) {
		var collide = false;
		playerBox = context.getImageData(playerX - 1, playerY - 1, 2, 2);
		// console.log(playerBox);
		// console.log(wallColour);
		for (i = 0; i < playerBox.data.length; i+4){
			var checkColour = 'rgb(' + playerBox.data[i] + ',' + playerBox.data[i+1] + ',' + playerBox.data[i+2] + ')';
			if (checkColour == wallColour) {
				console.log('you died!');
				//display game over screen
				//game over function here()

			} else if (checkColour == endColour) {
				console.log('you win!');
				//display win screen
				//level complete function here()
			}
			break;
		}
	}


	//Level construction
	function drawMaze(level, levelData) {
		//draw the maze based on what level is called. 0 = white/empty, 1 = grey/wall, 2 = green/start, 3 = red/end
		floorColour = 'rgb(' + levelData.floor[0] + ',' + levelData.floor[1] + ',' + levelData.floor[2] + ')';
		wallColour = 'rgb(' + levelData.wall[0] + ',' + levelData.wall[1] + ',' + levelData.wall[2] + ')';
		startColour = 'rgb(' + levelData.start[0] + ',' + levelData.start[1] + ',' + levelData.start[2] + ')';
		endColour = 'rgb(' + levelData.end[0] + ',' + levelData.end[1] + ',' + levelData.end[2] + ')';

		for (i = 0; i < level.length; i++) {
			//Go through each row in the array
			for (j = 0; j < level[i].length; j++) {
				//Go through the row and draw by numbers
				drawBlock(level[i][j]);
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


	//Game
	$('#start').click(function() {
		$('#startScreen').css('visibility', 'hidden');
		drawMaze(level1, level1Data);
		//put mouse at specified start co-ords
		//Start timer
		//Button to next level
	});

	function gameOver() {
		//End timer
		//Show game over screen
		//restart button
	}

	function levelComplete() {
		//End timer
		//show level complete screen
		//display time/score
		//button to start next level
	}
		
	
	

});