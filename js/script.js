
var chessBoard = [];
var over = false;
var me = true;
// 初始化棋盘，都为空（0）
for (let i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (let j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}
// 赢法数组初始化
var wins = [];

// 赢法数组统计
var mywin = [];
var oppositewin = [];

for (let i = 0; i < 15; i++) {
	wins[i] = [];
	for (let j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
// 统计所有横着的的赢法
var count = 0;
for (let i = 0; i < 15; i++) {
	for (let j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++
	}
}
// 竖着的赢法
for (let i = 0; i < 11; i++) {
	for (let j = 0; j < 15; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j][count] = true;
		}
		count++
	}
}
// 斜着的赢法
for (let i = 0; i < 11; i++) {
	for (let j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++

	}
}
// 反斜着的赢法
for (let i = 0; i < 11; i++) {
	for (let j = 4; j < 15; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++

	}
}

for (let i = 0; i < count; i++) {
	mywin[i] = 0;
	oppositewin[i] = 0;
}
// console.log(count);

var chess = document.getElementById('chess');
var context = chess.getContext('2d');
context.strokeStyle = "black";


var logo = new Image();
logo.src = "image/logo.jfif";
logo.onload = function () {
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
	// oneStep(0, 0, me);
	// oneStep(1, 1, false);

}

var drawChessBoard = function () {
	for (var i = 0; i < 15; i++) {

		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.stroke();

		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
}


var oneStep = function (i, j, me) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	context.stroke();

	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);

	if (me) {
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");

	} else {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");

	}

	context.fillStyle = gradient;
	context.fill();

}

chess.onclick = function (e) {

	if (over) {
		return;
	}
	if (me) {
		var x = e.offsetX;
		var y = e.offsetY;
		var i = Math.floor(x / 30);
		var j = Math.floor(y / 30);
		if (chessBoard[i][j] == 0) {
			// console.log(chessBoard[i][j]);
			oneStep(i, j, me);

		}

		chessBoard[i][j] = 1;
		for (let k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				mywin[k]++;
				oppositewin[k] = 6;
				if (mywin[k] == 5) {
					window.alert("你赢了！！！");
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			computerAI();
		}

	}
}


var computerAI = function () {
	var myScore = [];
	var oppositeScore = [];
	var max = 0;
	var u = 0, v = 0;

	for (let i = 0; i < 15; i++) {
		myScore[i] = [];
		oppositeScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			oppositeScore[i][j] = 0;
		}
	}

	for (let i = 0; i < 15; i++) {
		for (let j = 0; j < 15; j++) {
			if (chessBoard[i][j] == 0) {
				for (let k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						switch (mywin[k]) {
							case 1:
								myScore[i][j] += 200;
								break;
							case 2:
								myScore[i][j] += 400;
								break;
							case 3:
								myScore[i][j] += 2000;
								break;
							case 4:
								myScore[i][j] += 10000;
								break;
							default:
								break;
						}

						switch (oppositewin[k]) {
							case 1:
								oppositeScore[i][j] += 400;
								break;
							case 2:
								oppositeScore[i][j] += 800;
								break;
							case 3:
								oppositeScore[i][j] += 4000;
								break;
							case 4:
								oppositeScore[i][j] += 20000;
								break;
							default:
								break;
						}
					}
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] == max) {
					if (oppositeScore[i][j] > oppositeScore[u][v]) {
						u = i;
						v = j;
					}

				}
				if (oppositeScore[i][j] > max) {
					max = oppositeScore[i][j];
					u = i;
					v = j;
				}
				else if (oppositeScore[i][j] == max) {
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}


				}
			}
		}
	}
	setTimeout(() => {
		oneStep(u, v, false);

	}, 1000);
	chessBoard[u][v] = 2;
	me = !me;
	for (let k = 0; k < count; k++) {
		if (wins[u][v][k]) {
			oppositewin[k]++;
			mywin[k] = 6;
			if (oppositewin[k] == 5) {
				window.alert("你输了！！！");
				over = true;
			}
		}
	}
}