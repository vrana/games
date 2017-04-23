function Tax(name, earns) {
	this.name = name;
	this.earns = earns;
}

Tax.prototype.visit = function (player) {
	earn(this.earns, player);
};

Tax.prototype.getEarns = function (player) {
	return this.earns;
};
