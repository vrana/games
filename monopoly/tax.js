function Tax(name, earns) {
	this.name = name;
	this.earns = earns;
}

Tax.prototype.visit = function (player) {
	earn(this.earns, player);
};
