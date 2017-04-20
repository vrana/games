function Rail(name) {
	this.name = name;
	this.price = 200;
}

Rail.prototype.amounts = [25, 50, 100, 200];

Rail.prototype.visit = function (player) {
	visitRailOrService.call(this, this.amounts, player);
};

Rail.prototype.getEarns = function () {
	var owns = getOwns.call(this);
	return this.amounts[owns && owns - 1];
};

Rail.prototype.updateEarns = function () {
	fields[5].div.getElementsByClassName('earns')[0].textContent = fields[5].getEarns();
	fields[15].div.getElementsByClassName('earns')[0].textContent = fields[15].getEarns();
	fields[25].div.getElementsByClassName('earns')[0].textContent = fields[25].getEarns();
	fields[35].div.getElementsByClassName('earns')[0].textContent = fields[35].getEarns();
};
