function Place(name, color, price, amounts, housePrice) {
	this.name = name;
	this.color = color;
	this.price = price;
	this.amounts = amounts;
	this.housePrice = housePrice;
	this.houses = 0;
	this.earns = amounts[this.houses];
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
	} else if (this.houses < 5) {
		for (var i = 0, field; field = fields[i]; i++) {
			if (field instanceof Place && field.color == this.color) {
				if (field.owner != player) {
					return;
				}
			}
		}
		if (this.multiUpgrades && this.houses < 3) {
			var options = [];
			for (var i = this.houses + 1; i <= 4; i++) {
				options.push('<option value=' + i + (i == this.houses + 1 ? ' selected' : '') + '>' + this.amounts[i]);
			}
			var select = '<select class=houses size=' + options.length + '>' + options.join('') + '</select>';
			ask('increase earns to ' + select + ' at ' + this.name + ' for ' + this.housePrice + ' each?', player, function (player) {
				var houses = +last(document.getElementsByClassName('houses')).value;
				return this.upgrade(houses, player);
			}.bind(this));
		} else {
			ask('increase earns to ' + this.amounts[this.houses + 1] + ' at ' + this.name + ' for ' + this.housePrice + '?', player, this.upgrade.bind(this, 1));
		}
	}
}

Place.prototype.upgrade = function (houses, player) {
	if (!player.tryPaying(this.housePrice * houses)) {
		return false;
	}
	this.houses += houses;
	this.earns = this.amounts[this.houses];
	this.updateEarns();
};

Place.prototype.updateEarns = function () {
	this.div.querySelector('.earns').textContent = this.earns - 10 * this.betted;
};
