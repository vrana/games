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

function playAndSave() {
	play();
	saveToStorage();
}

function play() {
	document.activeElement.blur();
	if (!players.length) {
		var numPlayers = 0;
		for (var i = 0; i < 4; i++) {
			var name = document.querySelector('#name' + i + ' input').value;
			if (name) {
				players[i] = new Player(name, i);
				players[i].moveFigure();
				players[i].refreshStats();
				numPlayers++;
			}
		}
		if (players.length) {
			var starting = Math.floor(Math.random() * numPlayers);
			for (var i = 0; i < 4; i++) {
				if (!players[i] && i <= starting) {
					starting++;
				}
				document.getElementById('name' + i).textContent = players[i] ? players[i].name : '';
			}
			changePlaying(starting - 1);
		}
		return;
	}
	
	questions = [];
	document.querySelector('.cancel').disabled = true;
	document.getElementById('message').textContent = '';
	
	changePlaying(getNextPlayerIndex());
	var player = players[playing];
	
	if (player.paused) {
		player.paused--;
		if (player.paused) {
			say(translate('wait {$turns} more turn.', {turns: player.paused}), player);
		} else {
			say(translate('you play next turn.'), player);
		}
		return;
	}
	
	var dice1 = rollDice('dice1');
	var dice2 = rollDice('dice2');
	
	if (player.jailed) {
		player.jailed = false;
		if (dice1 != (dice2 || 6)) {
			say(translate('you play next turn.'), player);
		} else {
			changePlaying(playing - 1);
			say(translate('you play.'), player);
		}
		return;
	}
	
	moveForward(dice1 + dice2, player);
	// TODO: Roll again if dice1 == (dice2 || 6), go to jail after three rolls.
	
	if (questions.length) {
		questions[0].primary = true;
	}
	
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.betted) {
			field.betted = 0;
			field.updateEarns();
		}
	}
}

function doConfirm() {
	var question = last(questions);
	if (!question) {
		playAndSave();
	} else if (question.callback(question.player) !== false) {
		document.activeElement.blur();
		questions.pop();
		disableOldQuestions();
		document.querySelector('.cancel').disabled = questions.length < 2;
		saveToStorage();
		question = last(questions);
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

window.onkeydown = function (event) {
	switch (event.keyCode) {
		case Keys.SPACE:
			if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement)) {
				playAndSave();
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

document.querySelector('#playLink button').onclick = playAndSave;
document.querySelector('.confirm').onclick = doConfirm;
document.querySelector('.cancel').onclick = cancel;

document.querySelector('#restart').onclick = function () {
	if (confirm(translate('Are you sure?'))) {
		clearStorage();
		location.reload();
	}
};

loadFromStorage();
