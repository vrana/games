function Place(name, color, price, amounts, upgradePrice) {
	this.name = name;
	this.color = color;
	this.price = price;
	this.amounts = amounts;
	this.upgradePrice = upgradePrice;
	this.upgrades = 0;
	this.betted = 0;
}

Place.prototype.visit = function (player) {
	if (!this.owner) {
		offerBuying.call(this, player);
	} else if (this.owner != player) {
		player.pay(this.getEarns(), this.owner);
		if (this.betted) {
			this.owner.pay(10 * this.betted, player);
		}
	} else if (this.upgrades < 5) {
		if (!this.ownsAllOfColor()) {
			return;
		}
		if (this.multiUpgrades && this.upgrades < 3) {
			var options = [];
			for (var i = 1; i <= 4 - this.upgrades; i++) {
				options.push('<option value=' + i + (i == 1 ? ' selected' : '') + '>' + this.amounts[this.upgrades + i]);
			}
			var select = '<select class=upgrades size=' + options.length + ' onchange="upgradesChange.call(this, ' + this.upgradePrice + ');">' + options.join('') + '</select>';
			var span = '<span class=upgradePrice>' + this.upgradePrice + '</span>';
			ask(translate('increase earns at {$name} to {$amount} for {$price}?', {amount: select, name: this.name, price: span}), player, function () {
				var upgrades = +last(document.getElementsByClassName('upgrades')).value;
				return this.upgrade(upgrades, player);
			}.bind(this));
		} else {
			ask(translate('increase earns at {$name} to {$amount} for {$price}?', {amount: this.amounts[this.upgrades + 1], name: this.name, price: this.upgradePrice}), player, this.upgrade.bind(this, 1));
		}
	}
};

Place.prototype.ownsAllOfColor = function () {
	for (var i = 0, field; field = fields[i]; i++) {
		if (field instanceof Place && field.color == this.color) {
			if (field.owner != this.owner) {
				return false;
			}
		}
	}
	return true;
};

/** @this {HTMLSelectElement} */
function upgradesChange(upgradePrice) {
	this.parentNode.querySelector('.upgradePrice').textContent = this.value * upgradePrice;
}

Place.prototype.upgrade = function (upgrades, player) {
	if (player != this.owner || !this.ownsAllOfColor()) {
		say(translate('you need to own all of this color.'), player);
		return false;
	}
	if (!this.owner.tryPaying(this.upgradePrice * upgrades)) {
		return false;
	}
	this.upgrades += upgrades;
	this.updateEarns();
};

Place.prototype.getEarns = function () {
	var jailed = (this.owner && (this.owner.position == 10 || this.owner.position == 30));
	return this.amounts[jailed && this.bettable ? 0 : this.upgrades];
};

Place.prototype.updateEarns = function (autoBet) {
	this.div.querySelector('.earns').textContent = this.getEarns() - 10 * this.betted;
	var player = players[getNextPlayerIndex()];
	if (this.bettable && this.upgrades >= 3 && this.owner != player && player.canBet()) {
		var distance = (this.index + fields.length - player.position) % fields.length;
		var closeBet = (distance > 0 && distance <= 6);
		var betLink = createDom('a', {
			href: '',
			className: (closeBet ? 'closeBet' : ''),
			onclick: this.offerBetting.bind(this)
		}, translate('bet'));
		this.div.querySelector('.earns').appendChild(document.createTextNode(' - '));
		this.div.querySelector('.earns').appendChild(betLink);
		if (autoBet && closeBet && player.lastBet != undefined && player.money > 0) {
			this.bet(player, Math.min(player.money, this.getEarns() / 10 + player.lastBet));
		}
	}
};

Place.prototype.offerBetting = function (event) {
	var player = players[getNextPlayerIndex()];
	var bet = Math.min(
		Math.max(0, this.getEarns() / 10 + (player.lastBet || 0)) - this.betted,
		player.money > 0 ? player.money : 100);
	var input = '<input class=price type=number step=100 min=' + (-this.betted) + ' max=' + player.money + ' value=' + bet + '>';
	ask(translate('bet {$amount} on {$name}?', {amount: input, name: this.name}), player, this.tryBetting.bind(this));
	event.cancelBubble = true;
	return false;
};

Place.prototype.tryBetting = function (player) {
	var price = +last(document.getElementsByClassName('price')).value;
	if (!price || price < -this.betted) {
		say(translate('input a valid amount.'), player);
		return false;
	}
	player.lastBet = (price == -this.betted ? undefined : this.betted + price - this.getEarns() / 10);
	return this.bet(player, price);
};

Place.prototype.bet = function (player, price) {
	if (!player.tryPaying(price, this.owner)) {
		return false;
	}
	this.betted += price;
	this.updateEarns();
};
