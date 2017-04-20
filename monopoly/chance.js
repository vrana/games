function goToNearestRail(player) {
	var behindRail = (player.position + 5) % 10; // E.g. (17 + 5) % 10 = 2 behind rail.
	moveForward(10 - behindRail, player); // E.g. from 17, move  to 17 + 10 - 2 = 25.
}

var chance = new Cards('Chance', [
	goToNearestRail,
	goToNearestRail,
	goToJail,
	goTo.bind(this, 11), // Go to Rašínovo nábřeží.
	goTo.bind(this, 0), // Go to start.
	goTo.bind(this, 5), // Go to Wilsonovo nádraží.
	goTo.bind(this, 24), // Go to Na příkopě.
	goTo.bind(this, 29), // Go to Václavské náměstí.
	earn.bind(this, 50),
	earn.bind(this, 150),
	earn.bind(this, -15),
	payForHouseAndHotel.bind(this, 40, 100),
	// TODO: Get out of jail card.
	
	function goToNearestService(player, diced) {
		var nearestService = player.position > 12 && player.position <= 28 ? 28 : 12;
		goTo(nearestService, player, diced);
	},

	function get50FromEveryone(player) {
		for (var i = 0; i < players.length; i++) {
			if (players[i] != player) {
				players[i].pay(50, player);
			}
		}
	},
	
	moveForward.bind(this, -3),
]);
