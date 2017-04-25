/** @this {Place|Rail|Service} */
function offerBuying(player) {
	ask('buy ' + this.name + ' for ' + this.price + '?', player, buy.bind(this));
}

/** @this {Place|Rail|Service} */
function buy(player) {
	if (!player.tryPaying(this.price)) {
		return false;
	}
	changeOwner.call(this, player);
}

/** @this {Place|Rail|Service} */
function changeOwner(owner) {
	if (this.owner) {
		this.div.classList.remove('owner' + this.owner.index);
	}
	this.owner = owner;
	if (owner) {
		this.div.classList.add('owner' + owner.index);
		this.div.classList.add('owned');
		this.div.onclick = offerSelling.bind(this);
	} else {
		this.div.classList.remove('owned');
		this.div.onclick = undefined;
	}
	if (this.updateEarns) {
		this.updateEarns();
	}
}

function escape(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function last(ar) {
	return ar[ar.length - 1];
}

/** @this {Place|Rail|Service} */
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
	// TODO: Disable selling if there are upgrades with the same color.
	ask('sell ' + this.name + ' for ' + input + ' to <select class=buyer size=' + options.length + '>' + options.join('') + '</select>?', this.owner, sell.bind(this));
}

/** @this {Place|Rail|Service} */
function sell() {
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
	if (!buyer.tryPaying(price, this.owner)) {
		return false;
	}
	changeOwner.call(this, buyer);
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
	p.innerHTML = (player ? escape(player.name) + ', ' : '') + message;
	document.getElementById('message').appendChild(p);
	p.scrollIntoView();
}

function ask(message, player, callback) {
	var question = '<b>' + message + '</b>';
	if (!questions.length || last(questions).message != question) {
		say(question, player);
		questions.push({message: question, player: player, callback: callback});
		document.querySelector('.cancel').disabled = questions.length < 2;
	}
}
