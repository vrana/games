function goTo(position, player, diced) {
	player.position = position;
	player.moveFigure();
	say(translate('you went to {$name}.', {name: fields[position].name}), player);
	if (fields[position].visit) {
		fields[position].visit(player, diced || 0);
	}
}

function moveForward(number, player) {
	var position = player.position;
	if (player.position + number > fields.length) {
		say(translate('you passed Start.'), player);
		start.visit(player);
	}
	goTo((player.position + number + fields.length) % fields.length, player, number); // + fields.length - number might be negative.
	
	if (position == 10 || position == 30) {
		for (var i = 0, field; field = fields[i]; i++) {
			if (field instanceof Place && field.owner == player) {
				field.updateEarns();
			}
		}
	}
}

function goToJail(player) {
	goTo(10, player);
	player.jailed = true;
}

function earn(amount, player) {
	player.pay(-amount);
}

function payForUpgrades(amount, lastAmount, player) {
	var pay = 0;
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.owner == player) {
			if (field.upgrades == 5) {
				pay += lastAmount;
			} else if (field.upgrades) {
				pay += amount * field.upgrades;
			}
		}
	}
	player.pay(pay);
}

function moveToNearestRail(player) {
	var behindRail = (player.position + 5) % 10; // E.g. (17 + 5) % 10 = 2 behind rail.
	moveForward(10 - behindRail, player); // E.g. from 17, move to 17 + 10 - 2 = 25.
}

function earnFromEveryone(amount, player) {
	for (var i = 0; i < players.length; i++) {
		if (players[i] && players[i] != player) {
			players[i].pay(amount, player);
		}
	}
}

function Cards(name, cards) {
	this.name = name;
	this.cards = cards;
}

Cards.prototype.visit = function (player, diced) {
	var card = this.cards[Math.floor(Math.random() * this.cards.length)]; // TODO: Shuffle cards instead.
	card(player, diced);
};
