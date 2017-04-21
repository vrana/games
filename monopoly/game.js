function position(i) {
	return {
		top: 10 + 66 * (i < 10 ? 10 - i : i < 20 ? 0 : i < 30 ? i - 20 : 10),
		left: 10 + 128 * (i < 10 ? 0 : i < 20 ? i - 10 : i < 30 ? 10 : 40 - i)
	};
}

for (var i = 0, field; field = fields[i]; i++) {
	var div = document.createElement('div');
	div.className = 'field';
	div.innerHTML = field.name + (field.price ? ' (' + field.price + ')' : '') + '<br><span class=earns>' + (field.getEarns ? field.getEarns() : '') + '</span>';
	div.style.borderTop = '10px solid ' + (field.color || 'silver');
	var pos = position(i);
	div.style.top = pos.top + 'px';
	div.style.left = pos.left + 'px';
	field.div = div;
	document.body.appendChild(div);
}

function rollDice(id) {
	var diced = Math.floor(Math.random() * 6) + 1;
	var dice = document.getElementById(id);
	dice.textContent = String.fromCharCode('⚀'.charCodeAt(0) - 1 + diced);
	dice.style.transform = 'rotate(' + ((Math.random() * 30) - 15) + 'deg)';
	return diced;
}

document.body.onbeforeunload = function () {
	return 'Are you sure to exit?';
};

var players = [];
var playing = -1;

function play() {
	if (!players.length) {
		for (var i = 0; i < 4; i++) {
			var name = document.querySelector('#name' + i + ' input').value;
			if (name) {
				players[i] = new Player(name, i);
			}
		}
		if (players.length) {
			for (var i = 0; i < 4; i++) {
				document.getElementById('name' + i).textContent = players[i] ? players[i].name : '';
			}
		}
		return false;
	}
	
	questions = [];
	document.getElementById('message').textContent = '';
	
	var player;
	do {
		playing = (playing + 1) % players.length;
		player = players[playing];
	} while (!player);
	
	if (player.jailed) {
		player.jailed = false;
		var dice1 = rollDice('dice1');
		var dice2 = rollDice('dice2');
		if (dice1 != dice2) {
			say('you get out of jail next turn.', player);
		} else {
			playing--;
			say('you get out of jail.', player);
		}
		return false;
	}
	
	for (var rolls = 1; ; rolls++) {
		var dice1 = rollDice('dice1');
		var dice2 = rollDice('dice2');
		// TODO: Make asynchronous.
		//~ if (rolls == 3 && dice1 == dice2) {
			//~ goToJail(player);
			//~ break;
		//~ }
		moveForward(dice1 + dice2, player);
		//~ if (dice1 != dice2) {
			break;
		//~ }
	}
	return false;
}

function doConfirm() {
	var question = last(questions);
	if (!question) {
		play();
	} else if (question.callback() !== false) {
		questions.pop();
		var question = last(questions);
		if (question) {
			say(question.message, question.player);
		}
	}
}

var Keys = {
	ENTER: 13,
	SPACE: 32,
	ESC: 27
};

var questions = [];

document.body.onkeydown = function (event) {
	switch (event.keyCode) {
		case Keys.SPACE:
			if (!(event.target instanceof HTMLInputElement)) {
				play();
			}
			break;
		case Keys.ENTER:
			doConfirm();
			break;
		case Keys.ESC:
			if (questions.length > 1) {
				questions.pop();
				var question = last(questions);
				say(question.message, question.player);
			}
			break;
	}
};

document.querySelector('#playLink a').onclick = play;
document.querySelector('#playLink button').onclick = doConfirm;
