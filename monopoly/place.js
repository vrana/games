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
			ask('increase earns to ' + select + ' at ' + this.name + ' for ' + this.upgradePrice + ' each?', player, function (player) {
				var upgrades = +last(document.getElementsByClassName('upgrades')).value;
				return this.upgrade(upgrades, player);
			}.bind(this));
		} else {
			ask('increase earns to ' + this.amounts[this.upgrades + 1] + ' at ' + this.name + ' for ' + this.upgradePrice + '?', player, this.upgrade.bind(this, 1));
		}
	}
}

Place.prototype.upgrade = function (upgrades, player) {
	if (!player.tryPaying(this.upgradePrice * upgrades)) {
		return false;
	}
	this.upgrades += upgrades;
	this.earns = this.amounts[this.upgrades];
	this.updateEarns();
};

Place.prototype.updateEarns = function () {
	this.div.querySelector('.earns').textContent = this.earns - 10 * this.betted;
};
