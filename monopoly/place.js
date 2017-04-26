function Place(name, color, price, amounts, upgradePrice) {
	this.name = name;
	this.color = color;
	this.price = price;
	this.amounts = amounts;
	this.upgradePrice = upgradePrice;
	this.upgrades = 0;
	this.earns = amounts[this.upgrades];
	this.betted = 0;
}

Place.prototype.visit = function (player) {
	if (!this.owner) {
		offerBuying.call(this, player);
	} else if (this.owner != player) {
		player.pay(this.earns, this.owner);
		if (this.betted) {
			this.owner.pay(10 * this.betted, player);
		}
	} else if (this.upgrades < 5) {
		for (var i = 0, field; field = fields[i]; i++) {
			if (field instanceof Place && field.color == this.color) {
				if (field.owner != player) {
					return;
				}
			}
		}
		if (this.multiUpgrades && this.upgrades < 3) {
			var options = [];
			for (var i = 1; i <= 4 - this.upgrades; i++) {
				options.push('<option value=' + i + (i == 1 ? ' selected' : '') + '>' + this.amounts[this.upgrades + i]);
			}
			var select = '<select class=upgrades size=' + options.length + '>' + options.join('') + '</select>';
			ask('increase earns to ' + select + ' at ' + this.name + ' for <span class=upgradePrice>' + this.upgradePrice + '</span>?', player, function () {
				var upgrades = +last(document.getElementsByClassName('upgrades')).value;
				return this.upgrade(upgrades);
			}.bind(this));
			var element = last(document.getElementsByClassName('upgrades'));
			element.focus();
			element.onchange = upgradesChange.bind(element, this.upgradePrice);
		} else {
			ask('increase earns to ' + this.amounts[this.upgrades + 1] + ' at ' + this.name + ' for ' + this.upgradePrice + '?', player, this.upgrade.bind(this, 1));
		}
	}
}

/** @this {HTMLSelectElement} */
function upgradesChange(upgradePrice) {
	this.parentNode.querySelector('.upgradePrice').textContent = this.value * upgradePrice;
}

Place.prototype.upgrade = function (upgrades) {
	if (!this.owner.tryPaying(this.upgradePrice * upgrades)) {
		return false;
	}
	this.upgrades += upgrades;
	this.earns = this.amounts[this.upgrades];
	this.updateEarns();
};

Place.prototype.updateEarns = function () {
	this.div.querySelector('.earns').textContent = this.earns - 10 * this.betted;
	var player = players[getNextPlayerIndex()];
	if (this.bettable && this.upgrades >= 3 && this.owner != player && player.canBet()) {
		var betLink = document.createElement('a');
		betLink.href = '';
		betLink.textContent = 'bet';
		var distance = (this.index + fields.length - player.position) % fields.length;
		betLink.className = (distance > 0 && distance <= 6 ? 'closeBet' : '');
		betLink.onclick = this.offerBetting.bind(this);
		this.div.querySelector('.earns').appendChild(document.createTextNode(' - '));
		this.div.querySelector('.earns').appendChild(betLink);
	}
};

Place.prototype.offerBetting = function (event) {
	var player = players[getNextPlayerIndex()];
	var input = '<input class=price type=number step=100 min=' + (-this.betted) + ' max=' + player.money + ' value=' + Math.min(this.earns / 10 - this.betted, player.money) + '>';
	ask('bet ' + input + ' on ' + this.name + '?', player, this.bet.bind(this));
	last(document.getElementsByClassName('price')).focus();
	event.cancelBubble = true;
	return false;
};

Place.prototype.bet = function (player) {
	var price = +last(document.getElementsByClassName('price')).value;
	if (!(price >= -this.betted)) { // price might be NaN.
		say('input a valid amount.', player);
		return false;
	}
	if (!player.tryPaying(price, this.owner)) {
		return false;
	}
	this.betted = this.betted + price;
	this.updateEarns();
}
