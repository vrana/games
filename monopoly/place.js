function Place(name, color, price, amounts, housePrice) {
	this.name = name;
	this.color = color;
	this.price = price;
	this.amounts = amounts;
	this.housePrice = housePrice;
	this.houses = 0;
	this.earns = amounts[this.houses];
}

Place.prototype.visit = function (player) {
	if (!this.owner) {
		offerBuying.call(this, player);
	} else if (this.owner != player) {
		player.pay(this.amounts[this.houses], this.owner);
	} else if (this.houses < 5) {
		for (var i = 0, field; field = fields[i]; i++) {
			if (field instanceof Place && field.color == this.color) {
				if (field.owner != player) {
					return;
				}
			}
		}
		ask('buy a house at ' + this.name + ' for ' + this.housePrice + '?', player, function () {
			if (player.money < this.housePrice) {
				say('you do not have enough money to buy a house at ' + this.name + ' for ' + this.housePrice + '.', player);
				return false;
			} else {
				player.pay(this.housePrice);
				this.houses++;
				this.earns = this.amounts[this.houses];
				this.div.querySelector('.earns').textContent = this.earns;
			}
		}.bind(this));
	}
}

Place.prototype.getEarns = function () {
	return this.earns;
};

Place.prototype.updateEarns = function () {
};
