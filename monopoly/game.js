function last(ar) {
	return ar[ar.length - 1];
}

function changePlaying(value) {
	playing = value;
	document.getElementById('playLink' + getNextPlayerIndex()).appendChild(document.getElementById('playLink'));
	for (var i = 0, field; field = fields[i]; i++) {
		if (field.bettable) {
			field.updateEarns();
		}
	}
}

function getNextPlayerIndex() {
	if (!players.length) {
		return 3;
	}
	var i = playing;
	do {
		i = (i + 1) % players.length;
	} while (!players[i]);
	return i;
}

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

/** @this {Place|Rail|Service} */
function offerSelling() {
	var input = '<input class=price type=number step=10 min=0 value=' + (this.price + (this.upgrades * this.upgradePrice || 0)) + '>';
	var options = [];
	if (this.owner.money < 0) {
		options.push('<option value=-1>bank');
	}
	for (var i = 0; i < 4; i++) {
		var player = players[i];
		if (player && player != this.owner) {
			options.push('<option value=' + i + '>' + escape(player.name));
		}
	}
	if (!options.length) {
		say('nobody to sell to.', this.owner);
		return;
	}
	// TODO: Disable selling if there are upgrades with the same color.
	ask('sell ' + this.name + ' for ' + input + ' to <select class=buyer size=' + options.length + '>' + options.join('') + '</select>?', this.owner, sell.bind(this));
	last(document.getElementsByClassName('price')).focus();
}

/** @this {Place|Rail|Service} */
function sell() {
	var price = +last(document.getElementsByClassName('price')).value;
	var buyerIndex = last(document.getElementsByClassName('buyer')).value;
	if (!price || price < 0) { // price might be NaN.
		say('input a valid price.', this.owner);
		return false;
	}
	if (!buyerIndex) {
		say('select a buyer.', this.owner);
		return false;
	}
	var buyer = players[buyerIndex];
	if (!buyer) {
		earn(price, this.owner);
	} else if (!buyer.tryPaying(price, this.owner)) {
		return false;
	}
	changeOwner.call(this, buyer);
}

function escape(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
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
		var index = questions.length && questions[0].primary ? 1 : 0;
		questions[index] = {message: question, player: player, callback: callback};
		document.querySelector('.cancel').disabled = questions.length < 2;
	}
}

function position(i) {
	return {
		top: 10 + 66 * (i < 10 ? 10 - i : i < 20 ? 0 : i < 30 ? i - 20 : 10),
		left: 10 + 128 * (i < 10 ? 0 : i < 20 ? i - 10 : i < 30 ? 10 : 40 - i)
	};
}

for (var i = 0, field; field = fields[i]; i++) {
	field.index = i;
	var div = document.createElement('div');
	div.className = 'field';
	div.innerHTML = field.name + (field.price ? ' (' + field.price + ')' : '') + '<br><span class=earns>' + (field.getEarns ? field.getEarns() : field.earns || '') + '</span>';
	div.style.borderTop = '10px solid ' + (field.color || 'silver');
	var pos = position(i);
	div.style.top = pos.top + 'px';
	div.style.left = pos.left + 'px';
	field.div = div;
	document.body.appendChild(div);
}

var players = [];
var playing = -1;
