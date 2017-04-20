function Service(name) {
	this.name = name;
	this.price = 150;
}

Service.prototype.visit = function (player, diced) {
	visitRailOrService.call(this, [4 * diced, 10 * diced], player);
};

Service.prototype.getEarns = function () {
	return getOwns.call(this) == 2 ? '10*' : '4*';
};

Service.prototype.updateEarns = function () {
	fields[12].div.querySelector('.earns').textContent = fields[12].getEarns(); // Energetické závody
	fields[28].div.querySelector('.earns').textContent = fields[28].getEarns(); // Vodárna
};
