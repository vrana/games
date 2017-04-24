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
			var input = '<input class=houses type=number value=1 min=1 max=' + (4 - this.houses) + '>';
			ask('buy ' + input + ' upgrades of ' + this.name + ' for ' + this.housePrice + ' each?', player, this.upgrade.bind(this));
		} else {
			ask('upgrade <input type=hidden value=1>' + this.name + ' for ' + this.housePrice + '?', player, this.upgrade.bind(this));
		}
	}
}

Place.prototype.upgrade = function (player) {
	var houses = +last(document.getElementsByTagName('input')).value;
	if (!(houses > 0)) { // price might be NaN.
		say('input a valid number.', this.owner);
		return false;
	}
	var maxHouses = (this.houses < 3 ? 4 - this.houses : 1);
	if (houses > maxHouses) {
		say('you could not buy more than ' + maxHouses + ' upgrades.', this.owner);
		return false;
	} else if (player.money < this.housePrice * houses) {
		say('you do not have enough money to upgrade ' + this.name + ' for ' + (this.housePrice * houses) + '.', player);
		return false;
	} else {
		player.pay(this.housePrice * houses);
		this.houses += houses;
		this.earns = this.amounts[this.houses];
		this.updateEarns();
	}
};

Place.prototype.updateEarns = function () {
	this.div.querySelector('.earns').textContent = this.earns - 10 * this.betted;
};
