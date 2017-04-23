function Tax(name, price) {
	this.name = name;
	this.price = price;
}

Tax.prototype.visit = function (player) {
	player.pay(this.price);
};
