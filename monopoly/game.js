function position(i) {
	return {
		top: 10 + 66 * (i < 10 ? 10 - i : i < 20 ? 0 : i < 30 ? i - 20 : 10),
		left: 10 + 128 * (i < 10 ? 0 : i < 20 ? i - 10 : i < 30 ? 10 : 40 - i)
	};
}

for (var i = 0, field; field = fields[i]; i++) {
	var div = document.createElement('div');
	div.className = 'field';
	div.innerHTML = field.name + (field.price ? ' (' + field.price + ')' : '') + '<br><span class=earns>' + (field.getEarns ? field.getEarns() : field.earns || '') + '</span>';
	div.style.borderTop = '10px solid ' + (field.color || 'silver');
	var pos = position(i);
	div.style.top = pos.top + 'px';
	div.style.left = pos.left + 'px';
	field.div = div;
	document.body.appendChild(div);
}

function rollDice(id) {
	var dice = document.getElementById(id);
	if (!dice) {
		return 0;
	}
	var diced = Math.floor(Math.random() * 6) + 1;
	dice.textContent = String.fromCharCode('⚀'.charCodeAt(0) - 1 + diced);
	dice.style.transform = 'rotate(' + (Math.random() * 30 - 15) + 'deg)';
	return diced;
}

document.body.onbeforeunload = function () {
	return 'Are you sure to exit?';
};

var players = [];
var playing = -1;

function play() {
	document.activeElement.blur();
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
		return;
	}
	
	questions = [];
	document.querySelector('.cancel').disabled = true;
	document.getElementById('message').textContent = '';
	
	playing = getNextPlayerIndex();
	var player = players[playing];
	
	if (player.paused) {
		player.paused--;
		if (player.paused) {
			say('wait ' + player.paused + ' more turn.', player);
		} else {
			say('you play next turn.', player);
		}
		return;
	}
	
	var dice1 = rollDice('dice1');
	var dice2 = rollDice('dice2');
	
	if (player.jailed) {
		player.jailed = false;
		if (dice1 != dice2 || 6) {
			say('you play next turn.', player);
		} else {
			playing--;
			say('you play.', player);
		}
		return;
	}
	
	if (player.position == 10 || player.position == 30) {
		for (var i = 0, field; field = fields[i]; i++) {
			if (field instanceof Place && field.owner == player) {
				field.earns = field.amounts[field.houses];
				field.updateEarns();
			}
		}
	}
	
	moveForward(dice1 + dice2, player);
	// TODO: Roll again if dice1 == dice2, go to jail after three rolls.
	
	setTimeout(function () {
		for (var i = 0, field; field = fields[i]; i++) {
			if (field.betted) {
				field.betted = 0;
				field.updateEarns();
			}
		}
	}, 0);
}

function getNextPlayerIndex() {
	var i = playing;
	do {
		i = (i + 1) % players.length;
	} while (!players[i]);
	return i;
}

function doConfirm() {
	var question = last(questions);
	if (!question) {
		play();
	} else if (question.callback() !== false) {
		document.activeElement.blur();
		questions.pop();
		document.querySelector('.cancel').disabled = questions.length < 2;
		var question = last(questions);
		if (question) {
			say(question.message, question.player);
		}
	}
}

function cancel() {
	document.activeElement.blur();
	if (questions.length > 1) {
		questions.pop();
		document.querySelector('.cancel').disabled = questions.length < 2;
		var question = last(questions);
		say(question.message, question.player);
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
			if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement)) {
				play();
			}
			break;
		case Keys.ENTER:
			if (!(event.target instanceof HTMLButtonElement)) {
				doConfirm();
			}
			break;
		case Keys.ESC:
			cancel();
			break;
	}
};

document.querySelector('#playLink a').onclick = function () {
	play();
	return false;
};

document.querySelector('.confirm').onclick = doConfirm;

document.querySelector('.cancel').onclick = cancel;
