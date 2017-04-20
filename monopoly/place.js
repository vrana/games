function Place(name, color, price, amounts, housePrice) {
	this.name = name;
	this.color = color;
	this.price = price;
	this.amounts = amounts;
	this.housePrice = housePrice;
	this.houses = 0;
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
		ask('do you want to buy a house at ' + this.name + ' for ' + this.housePrice + '?', player, function () {
			if (player.money < this.housePrice) {
				say('you do not enough money to buy a house at ' + this.name + ' for ' + this.housePrice + '.', player);
			} else {
				player.pay(this.housePrice);
				this.houses++;
				this.div.querySelector('.earns').textContent = this.getEarns();
			}
		}.bind(this));
	}
}

Place.prototype.getEarns = function () {
	return this.amounts[this.houses];
};

Place.prototype.updateEarns = function () {
};
