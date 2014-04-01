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
	 

	var sfxMouseover = new Audio('sounds/mouseover.mp3');
	var sfxDing = new Audio('sounds/ding.mp3');
	var sfxGameover = new Audio('sounds/gameover.mp3');
	var sfxApplause = new Audio('sounds/applause.mp3');
	var sfxScribble = new Audio('sounds/scribble.mp3');

	var currentMusic;

	var openLevels = [true, false, false, false, false, false, false, false, false, false];
	var openLevels = [true, true, true, true, true, true, true, true, true, true]; //Use this for testing stuff without needing to complete levels
	var levelRef; //Reference to index of current level in the above array

	//Line style
	context.lineCap = 'round';
	context.lineJoin = 'round';
	context.lineWidth = 1;
	context.strokeStyle = 'black';	

	//Level completition will be timed. Should start from when the mouse leaves the green until it enters the red.

	//If the player touches the wall they die. This stops them just rushing through and bouncing off the walls to get the best score

	//HARD MODE: A black screen covers the maze. There is a circle of visibility surrounding the players mouse. This is another canvas on top of the bottom one. The circle is completely see-through

	//This one just checks whether a level is open or not and colour codes the buttons accordingly
	function levelOpenCheck() {
		for (i = 0; i < openLevels.length; i++) {
			if (openLevels[i] == true) {
				var buttonId = 'startLevel' + (i+1); 
				$('#' + buttonId).css('background-color', 'rgb(0, 200, 0)');
			} else if (openLevels[i] == false) {
				var buttonId = 'startLevel' + (i+1);
				$('#' + buttonId).css('background-color', 'rgb(200, 0, 0)');
			}
		}
	}

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
			timerStop();			
			gameOver();
		} else if (checkColour == endColour && timerOn == true) {
			//display win screen and stop timer
			timerStop();
			levelComplete();
		} else if (checkColour == endColour && timerOn == false) {
			alert('Nice try!');
		} else if (checkColour == startColour && timerOn == false) {
			//Start the timer
			timerStart();
			sfxDing.play();
			// musMusic1.play();
			loopMusic(currentMusic);
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
		lineColour = 'rgb(' + levelData.line[0] + ',' + levelData.line[1] + ',' + levelData.line[2] + ')'

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
		context.strokeStyle = lineColour;
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
		timerOn = true;
		startTime = new Date();
	}
	function timerStop() {
		timerOn = false;
		endTime = new Date();	
	}

	function startLevel(level, levelData, positionInOpenLevelsArray) {
		if (openLevels[positionInOpenLevelsArray] == true) {
			$('#startScreen').css('visibility', 'hidden');
			$('#levelCompleteScreen').css('visibility', 'hidden');
			$('#gameOverScreen').css('visibility', 'hidden');
			$('#levelSelection').css('visibility', 'hidden');
			levelRef = positionInOpenLevelsArray + 1;			
			currentMusic = levelData.music;
			drawMaze(level, levelData);
		} else if (openLevels[positionInOpenLevelsArray] == false) {
			console.log('level inaccessible');
		}
	}
	function levelComplete() {
		unbindMouse();
		// musMusic1.pause();
		// musMusic1.currentTime = 0;
		stopMusic(currentMusic);
		sfxApplause.play();
		$('#levelCompleteScreen').css('visibility', 'visible');
		$('#levelSelection').css('visibility', 'visible');
		var playerTime = (endTime.getTime() - startTime.getTime())/1000;
		$('#levelCompleteScreen').html('<h1>Winner!</h1><h2>Your time: ' + playerTime + ' seconds</h2>');
		openLevels[levelRef] = true;
		levelOpenCheck();
	}		
	function gameOver() {
		unbindMouse();
		// musMusic1.pause();
		// musMusic1.currentTime = 0;
		stopMusic(currentMusic);
		sfxGameover.play();	
		$('#gameOverScreen').css('visibility', 'visible');
		$('#levelSelection').css('visibility', 'visible');
	}

	//Music
	function loopMusic(music) {
		//It's not perfect but it works
		music.currentTime = 0;
		music.play();
		music.loop = true;
		//It will check at 9000ms and at that point currentTime will be 1ms over 8999
		// musicLoop = setInterval(function() {
		// 	if (music.currentTime >= 7.999) {

		// 		music.currentTime = 0;

		// 	}
		// }, 1000)
	}
	function stopMusic(music) {
		music.pause();
		// clearInterval(musicLoop);
	}

	//Level selection buttons
	$('.startLevel').click(function() {
		switch(this.id) {
			case 'startLevel1':
				startLevel(map1, map1Data, 0);
				break;
			case 'startLevel2':
				startLevel(map2, map2Data, 1);
				break;
			case 'startLevel3':
				startLevel(map3, map3Data, 2);
				break;
			case 'startLevel4':
				startLevel(map4, map4Data, 3);
				break;
			case 'startLevel5':
				startLevel(map5, map5Data, 4);
				break;
			case 'startLevel6':
				startLevel(map6, map6Data, 5);
				break;
			case 'startLevel7':
				startLevel(map7, map7Data, 6);
				break;
			case 'startLevel8':
				startLevel(map8, map8Data, 7);
				break;
			case 'startLevel9':
				startLevel(map9, map9Data, 8);
				break;
			case 'startLevel10':
				startLevel(map10, map10Data, 9);
				break;
		}		
	});

	$('.button').mouseover(function() {
		sfxMouseover.play();
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

	levelOpenCheck();
});