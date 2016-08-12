var player, win, choose; // P2 can be computer or other player
var ai, val = 'pvp';
var playGround = [
	[],
	[],
	[]
];
var canvas = document.getElementById("playGround");

var signX = document.getElementById("x");
var signO = document.getElementById("o");

var ctx = signX.getContext('2d');

drawX(100, 100)

ctx = signO.getContext('2d');

drawO(100, 100)

ctx = canvas.getContext('2d');

function initPvP() {
	// body...  drawTable is called here, this run after chooseSign runs in startGame and after game end (reset)
	drawTable();
	player = choose;
	win = false;
	playGround = [
		[],
		[],
		[]
	];
	for (var i = 0; i < playGround.length; i++) {
		for (var j = 0; j < 3; j++) {
			playGround[i].push([i, j]);
		}
	}
	move();
}

function initEasy() {
	drawTable();
	player = choose;
	ai = new easyAI();
	ai.setSeed(choose);
	win = false;
	playGround = [
		[],
		[],
		[]
	];
	for (var i = 0; i < playGround.length; i++) {
		for (var j = 0; j < 3; j++) {
			playGround[i].push([i, j]);
		}
	}
	moveWithAI();
}

function chooseSign() {
	$('#x').click(function() {
		choose = $(this).attr('id').toUpperCase();
		$('#alert').fadeOut();
		init(val);
	})
	$('#o').click(function() {
		choose = $(this).attr('id').toUpperCase();
		$('#alert').fadeOut();
		init(val);
	})
}

function setVal(_val) {
	val = _val;
}

function init(val) {
	switch (val) {
		case 'pvp':
			initPvP();
			break;
		case 'easy':
			initEasy();
			break;
	}
}

// For Checking function, return bool

function isWin(lastCheck) {
	var col = lastCheck[0];
	var row = lastCheck[1];
	if (playGround[0][row][2] == playGround[1][row][2] && playGround[0][row][2] == playGround[2][row][2]) {
		return [true, 'row'];
	}
	if (playGround[col][0][2] == playGround[col][1][2] && playGround[col][0][2] == playGround[col][2][2]) {
		return [true, 'col'];
	}
	if (playGround[0][0][2] == playGround[1][1][2] && playGround[0][0][2] == playGround[2][2][2] && playGround[1][1][2] == lastCheck[2]) {
		return [true, 'slash1'];
	}
	if (playGround[2][0][2] == playGround[0][2][2] && playGround[2][0][2] == playGround[1][1][2] && playGround[1][1][2] == lastCheck[2]) {
		return [true, 'slash2'];
	}
	return false;
}
//function isFork (type) { //Fork is for mor intelligent boy
//	var count = 0;
//	for (var i = 0; i < playGround.length; i++) {
//		for(var j = 0; j < playGround[i].length; j++){
//			playGround[i][j].push(type);
//			if (isWin([i,j,type])) {
//				count++;
//			}
//			playGround[i][j].pop();
//		}
//	}
//	return count>1? true : false;
//}  laterrrr
function isFull() {
	for (var i = 0; i < playGround.length; i++) {
		for (var j = 0; j < playGround[i].length; j++) {
			if (!playGround[i][j][2]) {
				return false;
			}
		}
	}
	return true;
}

function legalMove() {
	var res = [];
	for (var i = 0; i < playGround.length; i++) {
		for (var j = 0; j < playGround[i].length; j++) {
			if (!playGround[i][j][2] || playGround[i][j][2] === "") {
				res.push([i, j]);
			}
		}
	}
	return res;
}

// Let's play!!!

// Remember to check win
function getCoord(event) {
	var _x = event.clientX;
	var _y = event.clientY;
	_x -= canvas.offsetLeft - 300;
	_y -= canvas.offsetTop + 50;
	return [_x, _y];
}

function move() {
	$('#playGround').click(function() {
		var _x = (getCoord(event)[0] / 200) | 0;
		var _y = (getCoord(event)[1] / 200) | 0;
		if (!playGround[_x][_y][2] && !win) {
			playGround[_x][_y][2] = player === 'X' ? 'X' : 'O';
			player === 'X' ? drawX(_x * 200 + 100, _y * 200 + 100) : drawO(_x * 200 + 100, _y * 200 + 100);
			if (isWin(playGround[_x][_y])[0]) {
				switch (isWin(playGround[_x][_y])[1]) {
					case 'col':
						drawWinLine(_x * 200 + 100, 100, _x * 200 + 100, 500, player === 'X' ? 'red' : 'blue');
						break;
					case 'row':
						drawWinLine(100, _y * 200 + 100, 500, _y * 200 + 100, player === 'X' ? 'red' : 'blue');
						break;
					case 'slash1':
						drawWinLine(100, 100, 500, 500, player === 'X' ? 'red' : 'blue');
						break;
					case 'slash2':
						drawWinLine(100, 500, 500, 100, player === 'X' ? 'red' : 'blue');
						break;
				}
				win = true;
				endGame();
			}
			player = player === 'X' ? 'O' : 'X';
		}
		if (isFull()) {
			endGame();
		}
	})
}

function endGame() {
	setTimeout(function() {
		init(val);
	}, 1000);
}

function moveWithAI() {
	ai.randAtk();
	$('#playGround').click(function() {
		var _x = (getCoord(event)[0] / 200) | 0;
		var _y = (getCoord(event)[1] / 200) | 0;
		if (!playGround[_x][_y][2] && !win) {
			playGround[_x][_y][2] = player === 'X' ? 'X' : 'O';
			player === 'X' ? drawX(_x * 200 + 100, _y * 200 + 100) : drawO(_x * 200 + 100, _y * 200 + 100);
			if (isWin(playGround[_x][_y])[0]) {
				switch (isWin(playGround[_x][_y])[1]) {
					case 'col':
						drawWinLine(_x * 200 + 100, 100, _x * 200 + 100, 500, player === 'X' ? 'red' : 'blue');
						break;
					case 'row':
						drawWinLine(100, _y * 200 + 100, 500, _y * 200 + 100, player === 'X' ? 'red' : 'blue');
						break;
					case 'slash1':
						drawWinLine(100, 100, 500, 500, player === 'X' ? 'red' : 'blue');
						break;
					case 'slash2':
						drawWinLine(100, 500, 500, 100, player === 'X' ? 'red' : 'blue');
						break;
				}
				win = true;
				endGame();
				return;
			} else {
				ai.play();
				if (isWin(playGround[nextMove[0]][nextMove[1]])[0]) {
					win = true;
					switch (isWin(playGround[nextMove[0]][nextMove[1]])[1]) {
						case 'col':
							drawWinLine(nextMove[0] * 200 + 100, 100, nextMove[0] * 200 + 100, 500, ai.getSeed() === 'X' ? 'red' : 'blue');
							break;
						case 'row':
							drawWinLine(100, nextMove[1] * 200 + 100, 500, nextMove[1] * 200 + 100, ai.getSeed() === 'X' ? 'red' : 'blue');
							break;
						case 'slash1':
							drawWinLine(100, 100, 500, 500, ai.getSeed() === 'X' ? 'red' : 'blue');
							break;
						case 'slash2':
							drawWinLine(100, 500, 500, 100, ai.getSeed() === 'X' ? 'red' : 'blue');
							break;
					}
					endGame();
				}
			}
		}
		if (isFull()) {
			endGame();
		}
	})
}

// Function for  drawing

function drawTable() {
	// body...  use ctx.lineCap= "round" property to draw rounded end line
	ctx.clearRect(0, 0, 600, 600);
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.lineWidth = 20;
	ctx.strokeStyle = 'black';
	ctx.moveTo(20, 200);
	ctx.lineTo(580, 200);
	ctx.moveTo(20, 400);
	ctx.lineTo(580, 400);
	ctx.moveTo(200, 20);
	ctx.lineTo(200, 580);
	ctx.moveTo(400, 20);
	ctx.lineTo(400, 580);
	ctx.stroke();
} //Wrote

function drawX(x, y) {
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.lineWidth = 20;
	ctx.strokeStyle = 'red';
	ctx.moveTo(x - 70, y - 70);
	ctx.lineTo(x + 70, y + 70)
	ctx.moveTo(x - 70, y + 70);
	ctx.lineTo(x + 70, y - 70);
	ctx.stroke();
} //Wrote

function drawO(x, y) {
	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.strokeStyle = 'blue';
	ctx.arc(x, y, 70, 0, 2 * Math.PI)
	ctx.stroke();
} //Wrote

function drawWinLine(x1, y1, x2, y2, color) {
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.lineWidth = 20;
	ctx.strokeStyle = color == 'red' ? '#900' : '#009';
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
} //Wrote

// AI below

function easyAI() {
	var seed, oppSeed;

	this.getSeed = function() {
		return this.seed;
	}

	this.setSeed = function(choose) {
		this.seed = choose === 'O' ? 'X' : 'O';
		this.oppSeed = choose === 'O' ? 'O' : 'X';
	}

	this.randAtk = function() {
		nextMove = legalMove()[Math.floor(Math.random() * legalMove().length)];
		playGround[nextMove[0]][nextMove[1]][2] = this.seed;
		this.seed === 'X' ? drawX(nextMove[0] * 200 + 100, nextMove[1] * 200 + 100) : drawO(nextMove[0] * 200 + 100, nextMove[1] * 200 + 100);
	}

	this.play = function() {
		//if (this.win()) {          Win, block is for more intelligent AI
		//	this.win();
		//} else if (this.block()) {
		//	this.block();
		//} else {
		this.randAtk();
		//}
	}
}

// AI above

// Function for gaming

function startGame() {
	chooseSign();
}
startGame();
