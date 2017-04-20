var fields = [
	start,
	new Place('Klimentská ulice', 'maroon', 60, [2, 10, 30, 90, 160, 250], 50),
	finance,
	new Place('Revoluční ulice', 'maroon', 60, [4, 20, 60, 180, 320, 450], 50),
	new Tax(200),
	new Rail('Wilsonovo nádraží'),
	new Place('Panská ulice', 'aqua', 100, [6, 30, 90, 270, 400, 550], 50),
	chance,
	new Place('Jindřišská ulice', 'aqua', 100, [6, 30, 90, 270, 400, 550], 50),
	new Place('Vinohradská ulice', 'aqua', 120, [8, 40, 100, 300, 450, 600], 50),
	{name: 'Jail'},
	new Place('Rašínovo nábřeží', 'fuchsia', 120, [8, 40, 100, 300, 450, 600], 100),
	new Service('Energetické závody'),
	new Place('Masarykovo nábřeží', 'fuchsia', 140, [10, 50, 150, 450, 625, 750], 100),
	new Place('Smetanovo nábřeží', 'fuchsia', 160, [12, 60, 180, 500, 700, 900], 100),
	new Rail('Smíchovské nádraží'),
	new Place('Národní třída', 'orange', 180, [14, 70, 200, 550, 750, 950], 100),
	finance,
	new Place('Jungmannova ulice', 'orange', 180, [14, 70, 200, 550, 750, 950], 100),
	new Place('Vodičkova ulice', 'orange', 200, [16, 80, 220, 600, 800, 1000], 100),
	{name: 'Parking'},
	new Place('Rytířská ulice', 'red', 220, [18, 90, 250, 700, 875, 1050], 150),
	chance,
	new Place('Ovocný trh', 'red', 220, [18, 90, 250, 700, 875, 1050], 150),
	new Place('Na příkopě', 'red', 240, [20, 100, 300, 750, 925, 1100], 150),
	new Rail('Nádraží Holešovice'),
	new Place('Pařířská ulice', 'yellow', 260, [22, 110, 330, 800, 975, 1150], 150),
	new Place('Celetná ulice', 'yellow', 260, [22, 110, 330, 800, 975, 1150], 150),
	new Service('Vodárna'),
	new Place('Náměstí republiky', 'yellow', 280, [24, 120, 360, 850, 1025, 1200], 150),
	{name: 'Go to jail', visit: goToJail},
	new Place('Malostranské náměstí', 'lime', 300, [26, 130, 390, 900, 1100, 1275], 200),
	new Place('Kampa', 'lime', 300, [26, 130, 390, 900, 1100, 1275], 200),
	finance,
	new Place('Karlova ulice', 'lime', 320, [28, 150, 450, 1000, 1200, 1400], 200),
	new Rail('Masarykovo nádraží'),
	chance,
	new Place('Staroměstské náměstí', 'navy', 350, [35, 175, 500, 1100, 1300, 1500], 200),
	new Tax(100),
	new Place('Václavské náměstí', 'navy', 400, [50, 200, 600, 1400, 1700, 2000], 200),
];

function position(i) {
	return {
		top: 10 + 66 * (i < 10 ? 10 - i : i < 20 ? 0 : i < 30 ? i - 20 : 10),
		left: 10 + 130 * (i < 10 ? 0 : i < 20 ? i - 10 : i < 30 ? 10 : 40 - i)
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
			var name = document.getElementById('name' + i).getElementsByTagName('input')[0].value;
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

document.getElementById('playLink').onclick = play;
