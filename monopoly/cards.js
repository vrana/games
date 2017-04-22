function payForHouseAndHotel(housePrice, hotelPrice, player) {
	var pay = 0;
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.owner == player) {
			if (field.houses == 5) {
				pay += hotelPrice;
			} else if (field.houses) {
				pay += housePrice * field.houses;
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
	//~ this.position = 0;
}

Cards.prototype.visit = function (player, diced) {
	//~ this.position++;
	//~ var card = this.cards[this.position % this.cards.length];
	var card = this.cards[Math.floor(Math.random() * this.cards.length)]; // TODO: Shuffle cards instead.
	card(player, diced);
};
