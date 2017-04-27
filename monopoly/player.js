function Player(name, index) {
	this.name = name;
	this.index = index;
	this.position = 0;
	
	this.figure = createDom('div', {className: 'player player' + index}, '👤');
	document.getElementById('board').appendChild(this.figure);
}

Player.prototype.pay = function (amount, player) {
	if (player) {
		say(translate('you paid {$amount} to {$name}.', {amount: amount, name: player.name}), this);
		player.money += amount;
		player.refreshStats();
	} else if (amount < 0) {
		say(translate('you earned {$amount}.', {amount: -amount}), this);
	} else {
		say(translate('you paid {$amount}.', {amount: amount}), this);
		// TODO: Check if enough.
	}
	this.money -= amount;
	this.refreshStats();
};

Player.prototype.tryPaying = function (amount, player) {
	if (this.money < amount) {
		say(translate('you do not have {$amount} money.', {amount: amount}), this);
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
	if (this.jailed || this.paused) {
		return false;
	}
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.owner == this && field.upgrades >= 3) {
			return true;
		}
	}
	return false;
};
