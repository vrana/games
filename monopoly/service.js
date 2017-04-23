function getOwns() {
	var owns = 0;
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.owner && field.owner == this.owner && field instanceof this.constructor) {
			owns++;
		}
	}
	return owns;
}

function visitService(amounts, player) {
	if (!this.owner) {
		offerBuying.call(this, player);
	} else if (this.owner != player) {
		player.pay(amounts[getOwns.call(this) - 1], this.owner);
	}
}

function updateEarnsService() {
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.constructor == this.constructor) {
			field.div.querySelector('.earns').textContent = field.getEarns();
		}
	}
}


function Rail(name) {
	this.name = name;
}

Rail.prototype.visit = function (player) {
	visitService.call(this, this.amounts, player);
};

Rail.prototype.getEarns = function () {
	var owns = getOwns.call(this);
	return this.amounts[owns && owns - 1];
};

Rail.prototype.updateEarns = updateEarnsService;


function Service(name) {
	this.name = name;
}

Service.prototype.visit = function (player, diced) {
	visitService.call(this, [this.amounts[0] * diced, this.amounts[1] * diced], player);
};

Service.prototype.getEarns = function () {
	return this.amounts[getOwns.call(this) == 2 ? 1 : 0] + '*';
};

Service.prototype.updateEarns = updateEarnsService;
