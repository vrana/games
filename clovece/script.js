// TODO: sounds
// TODO: keyboard

var params = (new URL(document.location)).searchParams;
var players = (params.get('players') || 'yellow,green,blue,red').split(',');
var playing = -1;

// x, y
var plan = [
	[6, 0], [6, 1], [6, 2], [6, 3], [6, 4],
	[7, 4], [8, 4], [9, 4], [10, 4],
	[10, 5],
	[10, 6], [9, 6], [8, 6], [7, 6], [6, 6],
	[6, 7], [6, 8], [6, 9], [6, 10],
	[5, 10],
	[4, 10], [4, 9], [4, 8], [4, 7], [4, 6],
	[3, 6], [2, 6], [1, 6], [0, 6],
	[0, 5],
	[0, 4], [1, 4], [2, 4], [3, 4], [4, 4],
	[4, 3], [4, 2], [4, 1], [4, 0],
	[5, 0]
];

var starts = { blue: 0, red: 10, yellow: 20, green: 30 };
var ends = { blue: 39, red: 9, yellow: 19, green: 29 };
var homes = {
	blue: [ [9, 0], [10, 0], [9, 1], [10, 1] ],
	red: [ [9, 9], [10, 9], [9, 10], [10, 10] ],
	yellow: [ [0, 9], [1, 9], [0, 10], [1, 10] ],
	green: [ [0, 0], [1, 0], [0, 1], [1, 1] ]
};
var targets = {
	blue: [ [5, 1], [5, 2], [5, 3], [5, 4] ],
	red: [ [9, 5], [8, 5], [7, 5], [6, 5] ],
	yellow: [ [5, 9], [5, 8], [5, 7], [5, 6] ],
	green: [ [1, 5], [2, 5], [3, 5], [4, 5] ]
};

function addDiv(field) {
	var x = field[0];
	var y = field[1];
	game.rows[y].cells[x].appendChild(document.createElement('div'));
}

function setFieldClass(field, player) {
	var x = field[0];
	var y = field[1];
	game.rows[y].cells[x].className = player;
}

function getClass(field) {
	var x = field[0];
	var y = field[1];
	return game.rows[y].cells[x].firstChild.className;
}

function setClass(field, player) {
	var x = field[0];
	var y = field[1];
	game.rows[y].cells[x].firstChild.className = player;
}

var game = document.getElementById('game');
plan.forEach(addDiv);

for (var player in homes) {
	setFieldClass(plan[starts[player]], player);
	homes[player].forEach(function (field) {
		addDiv(field);
		setFieldClass(field, player);
		if (players.indexOf(player) != -1) {
			setClass(field, player);
		}
	});
	targets[player].forEach(function (field) {
		addDiv(field);
		setFieldClass(field, player);
	});
}

var rolled;
var dice = document.createElement('p');
game.rows[5].cells[5].id = 'dice';
game.rows[5].cells[5].appendChild(dice);
play(true);

function move(position) {
	var player = players[playing];
	for (var i = 0; i < rolled; i++) {
		if ((position + i) % plan.length == ends[player]) {
			moveInTarget(plan[position], rolled - i - 1);
			return;
		}
	}
	setClass(plan[position], '');
	kickAndSet((position + rolled) % plan.length, player);
}

function moveInTarget(oldField, newPosition) {
	var player = players[playing];
	var target = targets[player][newPosition];
	if (target && !getClass(target)) {
		setClass(oldField, '');
		setClass(target, player);
		return true;
	}
	return false;
}

function moveFromHome(home) {
	var player = players[playing];
	setClass(home, '');
	kickAndSet(starts[player], player);
}

function isOnPlan() {
	return plan.some(function (field) {
		return (getClass(field) == players[playing]);
	});
}

function isFinished() {
	return targets[players[playing]].every(function (field) {
		return getClass(field);
	});
}

function play(nextPlayer) {
	if (nextPlayer) {
		if (playing == -1 || !isFinished()) {
			playing++;
		} else if (players.length == 1) {
			alert('Done.');
			return;
		} else {
			players.splice(playing, 1);
		}
		playing %= players.length;
		document.getElementById('dice').className = players[playing];
	}
	for (var i = 0; i < 3; i++) { // Play three times if not on plan.
		rolled = Math.floor(6 * Math.random()) + 1;
		if (rolled == 6 || isOnPlan()) {
			break;
		}
	}
	dice.textContent = String.fromCharCode('⚀'.charCodeAt(0) + rolled - 1);
	dice.style.transform = 'rotate(' + (Math.random() * 30 - 15) + 'deg)';
}

function findField(element) {
	for (var y = 0; y < game.rows.length; y++) {
		var row = game.rows[y];
		for (var x = 0; x < row.cells.length; x++) {
			if (row.cells[x].firstChild == element) {
				return [x, y];
			}
		}
	}
}

function isSameField(a, b) {
	return (a[0] == b[0] && a[1] == b[1]);
}

function findPosition(fields, field) {
	for (var i = 0; i < fields.length; i++) {
		if (isSameField(fields[i], field)) {
			return i;
		}
	}
}

function kickAndSet(position, player) {
	var field = plan[position];
	var kicked = getClass(field);
	if (kicked) {
		homes[kicked].some(function (home) {
			if (!getClass(home)) {
				setClass(home, kicked);
				return true;
			}
		});
	}
	setClass(field, player);
}

game.onclick = function (event) {
	var element = event.target;
	if (element.tagName != 'DIV' || !element.className) {
		return;
	}
	var player = players[playing];
	if (element.className != player) {
		alert('Not playing.');
		return;
	}
	var field = findField(element);
	var position = findPosition(plan, field);
	if (position !== undefined) {
		move(position);
	} else if (rolled == 6) {
		position = findPosition(homes[player], field);
		if (position !== undefined) {
			moveFromHome(homes[player][position]);
		}
	} else {
		position = findPosition(targets[player], field);
		if (position !== undefined && !moveInTarget(field, position + rolled)) {
			position = undefined;
		}
	}
	if (position === undefined && isOnPlan()) {
		// TODO: This allows skipping a move if you have two pawns and one of them is just in front of target.
		// TODO: This allows skipping a move if you rolled 6, have noone on the plan but someone in the home.
		alert('You have to play.');
		return;
	}
	play(rolled != 6);
};
