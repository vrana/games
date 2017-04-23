function Player(name, index) {
	this.name = name;
	this.index = index;
	this.position = 0;
	
	this.figure = document.createElement('div');
	this.figure.textContent = '👤';
	this.figure.className = 'player player' + index;
	document.body.appendChild(this.figure);
	this.moveFigure();
	this.refreshStats();
}

Player.prototype.pay = function (amount, player) {
	if (amount < 0) {
		say('you earned ' + (-amount) + '.', this);
	} else {
		say('you paid ' + amount + (player ? ' to ' + player.name : '') + '.', this);
		// TODO: Check if enough.
		if (player) {
			player.money += amount;
			player.refreshStats();
		}
	}
	this.money -= amount;
	this.refreshStats();
};

Player.prototype.moveFigure = function () {
	var pos = position(this.position);
	this.figure.style.top = (pos.top + 45) + 'px';
	this.figure.style.left = (pos.left + 79 + 12 * this.index) + 'px';
};

Player.prototype.refreshStats = function () {
	document.getElementById('money' + this.index).textContent = this.money;
};
