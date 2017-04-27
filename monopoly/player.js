function Player(name, index) {
	this.name = name;
	this.index = index;
	this.position = 0;
	
	this.figure = document.createElement('div');
	this.figure.textContent = '👤';
	this.figure.className = 'player player' + index;
	document.getElementById('board').appendChild(this.figure);
}

Player.prototype.pay = function (amount, player) {
	if (player) {
		say('you paid ' + amount + ' to ' + player.name + '.', this);
		player.money += amount;
		player.refreshStats();
	} else if (amount < 0) {
		say('you earned ' + (-amount) + '.', this);
	} else {
		say('you paid ' + amount + '.', this);
		// TODO: Check if enough.
	}
	this.money -= amount;
	this.refreshStats();
};

Player.prototype.tryPaying = function (amount, player) {
	if (this.money < amount) {
		say('you do not have ' + amount + ' money.', this);
		return false;
	}
	this.pay(amount, player);
	return true;
};

Player.prototype.moveFigure = function () {
	var pos = position(this.position);
	this.figure.style.top = (pos.top + 45) + 'px';
	this.figure.style.left = (pos.left + 79 + 12 * this.index) + 'px';
};

Player.prototype.refreshStats = function () {
	document.getElementById('money' + this.index).textContent = this.money;
};

Player.prototype.canBet = function () {
	if (this.money <= 0 || this.jailed || this.paused) {
		return false;
	}
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.owner == this && field.upgrades >= 3) {
			return true;
		}
	}
	return false;
};
