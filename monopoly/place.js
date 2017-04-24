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
		ask('upgrade ' + this.name + ' for ' + this.housePrice + '?', player, this.upgrade.bind(this));
	}
}

Place.prototype.upgrade = function (player) {
	if (player.money < this.housePrice) {
		say('you do not have enough money to upgrade ' + this.name + ' for ' + this.housePrice + '.', player);
		return false;
	} else {
		player.pay(this.housePrice);
		this.houses++;
		this.earns = this.amounts[this.houses];
		this.updateEarns();
	}
};

Place.prototype.updateEarns = function () {
	this.div.querySelector('.earns').textContent = this.earns - 10 * this.betted;
};
