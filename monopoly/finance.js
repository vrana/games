function payForHouseAndHotel(housePrice, hotelPrice, player) {
	var pay = 0;
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.owner == player) {
			if (place.houses == 5) {
				pay += hotelPrice;
			} else if (place.houses) {
				pay += housePrice * place.houses;
			}
		}
	}
	player.pay(pay);
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

var finance = new Cards('Finance', [
	earn.bind(this, 200),
	earn.bind(this, -50),
	earn.bind(this, 100),
	earn.bind(this, 20),
	earn.bind(this, 100),
	earn.bind(this, 50),
	earn.bind(this, -50),
	earn.bind(this, 100),
	earn.bind(this, -100),
	earn.bind(this, 10),
	earn.bind(this, 25),
	goToJail,
	payForHouseAndHotel.bind(this, 40, 115),
	
	function get10FromEveryone(player) {
		for (var i = 0; i < players.length; i++) {
			if (players[i] != player) {
				players[i].pay(10, player);
			}
		}
	},
	
	goTo.bind(this, 0), // Go to start.
	
	// TODO: Get out of jail card.
]);
