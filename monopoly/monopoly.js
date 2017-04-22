var chance = new Cards('Chance', [
	moveToNearestRail,
	moveToNearestRail,
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
	earnFromEveryone.bind(this, 50),
	moveForward.bind(this, -3),
	// TODO: Get out of jail card.
	
	function goToNearestService(player, diced) {
		var nearestService = player.position > 12 && player.position <= 28 ? 28 : 12;
		goTo(nearestService, player, diced);
	},
]);


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
	earnFromEveryone.bind(this, 10),
	goTo.bind(this, 0), // Go to start.
	
	// TODO: Get out of jail card.
]);


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
