function Tax(price) {
	this.name = 'Tax';
	this.price = price;
}

Tax.prototype.visit = function (player) {
	player.pay(this.price);
};
