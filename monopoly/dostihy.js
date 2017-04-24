function backToFinance(player) {
	for (var i = player.position - 1; fields[i] != finance; i = (i - 1 + fields.length) % fields.length) {
	}
	goTo(i, player);
};


function pause(rounds, player) {
	say('wait ' + rounds + ' turns.', player);
	player.paused = rounds;
}


var chance = new Cards('Náhoda', [
	pause.bind(this, 2),
	pause.bind(this, 2),
	pause.bind(this, 1),
	goTo.bind(this, 0), // Go to start.
	goTo.bind(this, 0), // Go to start.
	goTo.bind(this, 39), // Go to Napoli.
	goTo.bind(this, 20), // Go to Parkoviště.
	goToJail,
	goToJail,
	moveForward.bind(this, -3),
	moveToNearestRail,
	backToFinance,
	backToFinance,
	// TODO: Get out of Distanc.
]);


var finance = new Cards('Finance', [
	earn.bind(this, 500),
	earn.bind(this, 2000),
	earn.bind(this, -1000),
	earn.bind(this, 1000),
	earn.bind(this, 2000),
	earn.bind(this, 4000),
	earn.bind(this, -3000),
	earn.bind(this, 3000),
	earn.bind(this, -400),
	earn.bind(this, -2000),
	earn.bind(this, -100),
	earnFromEveryone.bind(this, 200),
	payForHouseAndHotel.bind(this, 800, 2300),
	payForHouseAndHotel.bind(this, 500, 500),
]);


start.earns = 4000;
Place.prototype.bettable = true;
Place.prototype.multiUpgrades = true;
Player.prototype.money = 30000;
Rail.prototype.price = 4000;
Rail.prototype.amounts = [1000, 2000, 3000, 4000];
Service.prototype.price = 3000;
Service.prototype.amounts = [400, 1000];
// TODO: Allow buying more houses at once.


function jailed(paused, player) {
	if (paused) {
		player.paused = paused;
	} else {
		player.jailed = true;
	}
	for (var i = 0, field; field = fields[i]; i++) {
		if (field instanceof Place && field.owner == player) {
			field.earns = field.amounts[0];
			field.updateEarns();
		}
	}
}


var fields = [
	start,
	new Place('Fantome', 'orange', 1200, [40, 200, 600, 1800, 3200, 5000], 1000),
	finance,
	new Place('Gavora', 'orange', 1200, [40, 200, 600, 1800, 3200, 5000], 1000),
	new Tax('Veterinární vyšetření', -500),
	new Rail('1. trenér'),
	new Place('Lady Anne', 'maroon', 2000, [120, 600, 1800, 5400, 8000, 11000], 1000),
	chance,
	new Place('Pasek', 'maroon', 2000, [120, 600, 1800, 5400, 8000, 11000], 1000),
	new Place('Koran', 'maroon', 2400, [160, 800, 2000, 6000, 9000, 12000], 1000),
	{name: 'Distanc', visit: jailed.bind(this, 0)},
	new Place('Neklan', 'cyan', 2800, [200, 1000, 3000, 9000, 12500, 15000], 2000),
	new Service('Přeprava'),
	new Place('Portlancl', 'cyan', 2800, [200, 1000, 3000, 9000, 12500, 15000], 2000),
	new Place('Japan', 'cyan', 2800, [240, 1200, 3600, 10000, 14000, 18000], 2000),
	new Rail('2. trenér'),
	new Place('Kostrava', 'lime', 3600, [280, 1400, 4000, 11000, 15000, 19000], 2000),
	finance,
	new Place('Lukava', 'lime', 3600, [280, 1400, 4000, 11000, 15000, 19000], 2000),
	new Place('Melák', 'lime', 4000, [320, 1600, 4400, 12000, 16000, 20000], 2000),
	{name: 'Parkoviště'},
	new Place('Grifel', 'fuchsia', 4400, [360, 1800, 5000, 14000, 17000, 21000], 3000),
	chance,
	new Place('Mohyla', 'fuchsia', 4400, [360, 1800, 5000, 14000, 17000, 21000], 3000),
	new Place('Metál', 'fuchsia', 4800, [400, 2000, 6000, 15000, 18000, 22000], 3000),
	new Rail('3. trenér'),
	new Place('Tara', 'yellow', 5200, [440, 2200, 6600, 16000, 19500, 23000], 3000),
	new Place('Furioso', 'yellow', 5200, [440, 2200, 6600, 16000, 19500, 23000], 3000),
	new Service('Stáje'),
	new Place('Genius', 'yellow', 5600, [480, 2400, 7200, 17000, 20500, 24000], 3000),
	{name: 'Podezření z dopingu', visit: jailed.bind(this, 1)},
	new Place('Shagga', 'green', 6000, [500, 2600, 7800, 18000, 22000, 25500], 4000),
	new Place('Dahoman', 'green', 6000, [500, 2600, 7800, 18000, 22000, 25500], 4000),
	finance,
	new Place('Gira', 'green', 6400, [560, 3000, 9000, 20000, 24000, 28000], 4000),
	new Rail('4. trenér'),
	chance,
	new Place('Narcius', 'navy', 7000, [700, 3500, 10000, 22000, 26000, 30000], 4000),
	new Tax('Veterinární vyšetření', -1000),
	new Place('Napoli', 'navy', 8000, [1000, 4000, 12000, 28000, 34000, 40000], 4000),
];
