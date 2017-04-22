function getOwns() {
	var owns = 0;
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.owner && field.owner == this.owner && field instanceof this.constructor) {
			owns++;
		}
	}
	return owns;
}

function visitRailOrService(amounts, player) {
	if (!this.owner) {
		offerBuying.call(this, player);
	} else if (this.owner != player) {
		player.pay(amounts[getOwns.call(this) - 1], this.owner);
	}
}

function updateEarnsRailOrService() {
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.constructor == this.constructor) {
			field.div.querySelector('.earns').textContent = field.getEarns();
		}
	}
}


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

Rail.prototype.updateEarns = updateEarnsRailOrService;


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

Service.prototype.updateEarns = updateEarnsRailOrService;
