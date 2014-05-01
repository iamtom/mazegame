<?php
	if($_POST['formSubmit'] == 'Submit') {
		$level = $_POST['levelPlayed'];
		$playerName = $_POST['playerName'];
		$playerTime = $_POST['playerTime'];
	}
	//MUST VALIDATE NAME AND SCORE. 

	echo $playerName;
	echo $playerTime;
	echo $level;

	$mysqli = mysqli_connect("localhost", "root", "", "mazegamescores");
	mysqli_query($mysqli, "INSERT INTO {$level}(`Name`, `Time`) VALUES ('{$playerName}', '{$playerTime}')");
?>