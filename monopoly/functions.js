function offerBuying(player) {
	ask('buy ' + this.name + ' for ' + this.price + '?', player, function () {
		if (player.money < this.price) {
			say('you do not have enough money to buy ' + this.name + ' for ' + this.price + '.', player);
			return false;
		} else {
			player.pay(this.price);
			changeOwner.call(this, player);
			this.div.classList.add('owned');
			this.div.onclick = offerSelling.bind(this);
		}
	}.bind(this));
}

function changeOwner(owner) {
	this.owner = owner;
	this.div.classList.add('owner' + owner.index);
	this.updateEarns();
}

function escape(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function last(ar) {
	return ar[ar.length - 1];
}

function offerSelling() {
	var input = '<input class=price type=number step=10 min=0 value=' + this.price + '>';
	var options = [];
	// TODO: Sell to the bank for a fixed price.
	for (var i = 0; i < 4; i++) {
		var player = players[i];
		if (player && player != this.owner) {
			options.push('<option value=' + i + '>' + escape(player.name));
		}
	}
	// TODO: Disable selling if there are houses with the same color.
	ask('sell ' + this.name + ' for ' + input + ' to <select class=buyer size=' + options.length + '>' + options.join('') + '</select>?', this.owner, function () {
		var price = +last(document.getElementsByClassName('price')).value;
		var buyerIndex = last(document.getElementsByClassName('buyer')).value;
		if (!(price > 0)) { // price might be NaN.
			say('input a valid price.', this.owner);
			return false;
		}
		if (!buyerIndex) {
			say('select a buyer.', this.owner);
			return false;
		}
		var buyer = players[buyerIndex];
		if (buyer.money < price) {
			say('you do not have enough money to buy ' + this.name + ' for ' + price + '.', buyer);
			return false;
		} else {
			buyer.pay(price, this.owner);
			this.div.classList.remove('owner' + this.owner.index);
			changeOwner.call(this, buyer);
		}
	}.bind(this));
	
	if (this.bettable && this.houses >= 3) {
		var player = players[getNextPlayerIndex()];
		if (player.ownsPlaceWith3Houses()) {
			var input = '<input class=price type=number step=10 min=' + (-this.betted) + ' max=' + player.money + ' value=' + Math.min(100, player.money) + '>';
			ask('bet ' + input + ' on ' + this.name + '?', player, function () {
				var price = +last(document.getElementsByClassName('price')).value;
				if (!(price >= -this.betted)) { // price might be NaN.
					say('input a valid amount.', player);
					return false;
				}
				if (player.money < price) {
					say('you do not have enough money to bet ' + price + ' on ' + this.name + '.', player);
					return false;
				} else {
					player.pay(price, this.owner);
					this.betted = this.betted + price;
					this.updateEarns();
				}
			}.bind(this));
		}
	}
}

function goTo(position, player, diced) {
	player.position = position;
	player.moveFigure();
	say('you went to ' + fields[position].name + '.', player);
	if (fields[position].visit) {
		fields[position].visit(player, diced || 0);
	}
}

function moveForward(number, player) {
	if (player.position + number > fields.length) {
		say('you passed Start.', player);
		start.visit(player);
	}
	goTo((player.position + number + fields.length) % fields.length, player, number); // + fields.length - number might be negative.
}

function goToJail(player) {
	goTo(10, player);
	player.jailed = true;
}

function earn(amount, player) {
	player.pay(-amount);
}

function say(message, player) {
	var p = document.createElement('p');
	p.innerHTML = escape(player.name) + ', ' + message;
	document.getElementById('message').appendChild(p);
}

function ask(message, player, callback) {
	var question = '<b>' + message + '</b>';
	say(question, player);
	questions.push({message: question, player: player, callback: callback});
}
