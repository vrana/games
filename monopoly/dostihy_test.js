function setUp() {
	load({
		players: [
			{name: 'First'},
			{name: 'Second'}
		]
	});
}

runTests([

	function placeEarns() {
		buy.call(fields[1], players[0]);
		assertEquals(30000 - 1200, players[0].money);
		fields[1].visit(players[1]);
		assertEquals(30000 - 1200 + 40, players[0].money);
		assertEquals(30000 - 40, players[1].money);
	},

	function startEarns() {
		fields[0].visit(players[0]);
		assertEquals(30000 + 4000, players[0].money);
	},
	
	function passingStartEarns() {
		moveForward(41, players[0]);
		assertEquals(30000 + 4000, players[0].money);
	},
	
	function upgradeEarnsMore() {
		buy.call(fields[1], players[0]);
		fields[1].upgrade(1);
		assertEquals(30000 - 1200 - 1000, players[0].money);
		fields[1].visit(players[1]);
		assertEquals(30000 - 1200 - 1000 + 200, players[0].money);
		assertEquals(30000 - 200, players[1].money);
		fields[1].upgrade(3);
		assertEquals(30000 - 1200 - 1000 + 200 - 3000, players[0].money);
		fields[1].visit(players[1]);
		assertEquals(30000 - 1200 - 1000 + 200 - 3000 + 3200, players[0].money);
		assertEquals(30000 - 200 - 3200, players[1].money);
	},
	
	function railEarns() {
		buy.call(fields[5], players[0]);
		assertEquals(30000 - 4000, players[0].money);
		fields[5].visit(players[1]);
		assertEquals(30000 - 4000 + 1000, players[0].money);
		assertEquals(30000 - 1000, players[1].money);
		buy.call(fields[15], players[0]);
		fields[15].visit(players[1]);
		assertEquals(30000 - 4000 + 1000 - 4000 + 2000, players[0].money);
		assertEquals(30000 - 1000 - 2000, players[1].money);
		fields[5].visit(players[1]);
		assertEquals(30000 - 4000 + 1000 - 4000 + 2000 + 2000, players[0].money);
		assertEquals(30000 - 1000 - 2000 - 2000, players[1].money);
	},
	
	function serviceEarns() {
		buy.call(fields[12], players[0]);
		assertEquals(30000 - 3000, players[0].money);
		fields[12].visit(players[1], 3);
		assertEquals(30000 - 3000 + 3 * 400, players[0].money);
		assertEquals(30000 - 3 * 400, players[1].money);
		buy.call(fields[28], players[0]);
		fields[28].visit(players[1], 5);
		assertEquals(30000 - 3000 + 3 * 400 - 3000 + 5 * 1000, players[0].money);
		assertEquals(30000 - 3 * 400 - 5 * 1000, players[1].money);
		fields[12].visit(players[1], 1);
		assertEquals(30000 - 3000 + 3 * 400 - 3000 + 5 * 1000 + 1 * 1000, players[0].money);
		assertEquals(30000 - 3 * 400 - 5 * 1000 - 1 * 1000, players[1].money);
	},
	
	function distancEarnsLess() {
		buy.call(fields[1], players[0]);
		fields[1].upgrade(1);
		goTo(10, players[0]);
		fields[1].visit(players[1]);
		assertEquals(30000 - 1200 - 1000 + 40, players[0].money);
		assertEquals(30000 - 40, players[1].money);
		moveForward(1, players[0]);
		fields[1].visit(players[1]);
		assertEquals(30000 - 1200 - 1000 + 40 + 200, players[0].money);
		assertEquals(30000 - 40 - 200, players[1].money);
	},
	
	function dopingEarnsLess() {
		buy.call(fields[1], players[0]);
		fields[1].upgrade(1);
		goTo(30, players[0]);
		fields[1].visit(players[1]);
		assertEquals(30000 - 1200 - 1000 + 40, players[0].money);
		assertEquals(30000 - 40, players[1].money);
		moveForward(1, players[0]);
		fields[1].visit(players[1]);
		assertEquals(30000 - 1200 - 1000 + 40 + 200, players[0].money);
		assertEquals(30000 - 40 - 200, players[1].money);
	},
	
	function parkingDoesNothing() {
		goTo(20, players[0]);
		assertEquals(30000, players[0].money);
	},
	
	function taxLoses() {
		fields[4].visit(players[0]);
		assertEquals(30000 - 500, players[0].money);
	},
]);
