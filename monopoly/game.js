function last(ar) {
	return ar[ar.length - 1];
}

var translations = {
	'wait {$number} turn(s).': ['wait {$number} turn.', 'wait {$number} turns.'],
};

function pickPlural(msgs, variables) {
	if (msgs instanceof Array) {
		return (variables.number == 1 ? msgs[0] : msgs[1]);
	}
	return msgs;
}

function translate(msg, variables) {
	msg = pickPlural(translations[msg] || msg, variables);
	return msg.replace(/\{\$([^}]+)}/g, function(match, key) {
		return (key in variables ? variables[key] : match);
	});
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
		return maxPlayers - 1;
	}
	var i = playing;
	do {
		i = (i + 1) % players.length;
	} while (!players[i]);
	return i;
}

/** @this {Place|Rail|Service} */
function offerBuying(player) {
	ask(translate('buy {$name} for {$price}?', {name: this.name, price: this.price}), player, buy.bind(this));
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
		this.div.onclick = this.onclick;
	}
	if (this.updateEarns) {
		this.updateEarns();
	}
}

/** @this {Place|Rail|Service} */
function offerSelling() {
	var input = '<input class=price type=number step=100 min=0 value=' + (this.price + (this.upgrades * this.upgradePrice || 0)) + '>';
	var options = [];
	if (this.owner.money < 0) {
		options.push('<option value=-1>' + translate('bank'));
	}
	for (var i = 0; i < maxPlayers; i++) {
		var player = players[i];
		if (player && player != this.owner) {
			options.push('<option value=' + i + '>' + escape(player.name));
		}
	}
	if (!options.length) {
		say(translate('nobody to sell to.'), this.owner);
		return;
	}
	// TODO: Disable selling if there are upgrades with the same color.
	var onchange = (this.owner.money < 0 ? ' onchange="buyerChange.call(this, ' + (this.price + (this.upgrades * this.upgradePrice / 2 || 0)) + ');"' : '');
	var select = '<select class=buyer size=' + options.length + onchange + '>' + options.join('') + '</select>';
	ask(translate('sell {$name} for {$price} to {$buyer}?', {name: this.name, price: input, buyer: select}), this.owner, sell.bind(this));
}

/** @this {HTMLSelectElement} */
function buyerChange(bankPrice) {
	var element = this.parentNode.querySelector('.price');
	var isBank = (this.value == -1);
	if (element.disabled != isBank) {
		element.disabled = isBank;
		if (isBank) {
			element.lastValue = element.value;
			element.value = bankPrice;
		} else if (element.lastValue) {
			element.value = element.lastValue;
		}
	}
}

/** @this {Place|Rail|Service} */
function sell() {
	var price = +last(document.getElementsByClassName('price')).value;
	var buyerIndex = last(document.getElementsByClassName('buyer')).value;
	if (!price || price < 0) { // price might be NaN.
		say(translate('input a valid price.'), this.owner);
		return false;
	}
	if (!buyerIndex) {
		say(translate('select a buyer.'), this.owner);
		return false;
	}
	var buyer = players[buyerIndex];
	if (!buyer) {
		earn(price, this.owner);
		if (this.upgrades) {
			this.upgrades = 0;
		}
	} else if (!buyer.tryPaying(price, this.owner)) {
		return false;
	}
	changeOwner.call(this, buyer);
}

function createDom(tag, attributes, content) {
	var el = document.createElement(tag);
	for (var key in attributes || {}) {
		var val = attributes[key];
		if (typeof val == 'object') {
			for (var key2 in val) {
				el[key][key2] = val[key2];
			}
		} else {
			el[key] = val;
		}
	}
	var contents = (content instanceof Array ? content : [content]);
	for (var i = 0; content = contents[i]; i++) {
		el.appendChild(typeof content == 'string' ? document.createTextNode(content) : content);
	}
	return el;
}

function escape(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function say(message, player) {
	var p = createDom('p', {innerHTML: (player ? escape(player.name) + ', ' : '') + message});
	document.getElementById('message').appendChild(p);
	var element = p.querySelector('input, select');
	if (element) {
		element.focus();
		if (element.select) {
			element.select();
		}
	}
	p.scrollIntoView();
}

function ask(message, player, callback) {
	var question = '<b>' + message + '</b>';
	if (!questions.length || last(questions).message != question) {
		disableOldQuestions();
		say(question, player);
		var index = questions.length && questions[0].primary ? 1 : 0;
		questions[index] = {message: question, player: player, callback: callback};
		document.querySelector('.cancel').disabled = questions.length < 2;
	}
}

function disableOldQuestions() {
	var inputs = document.getElementById('message').querySelectorAll('select, input');
	for (var i = 0, input; input = inputs[i]; i++) {
		input.disabled = true;
	}
}

function position(i) {
	return {
		top: 10 + 66 * (i < 10 ? 0 : i < 20 ? i - 10 : i < 30 ? 10 : 40 - i),
		left: 10 + 128 * (i < 10 ? i : i < 20 ? 10 : i < 30 ? 30 - i : 0)
	};
}

function clearDice() {
	for (var i = 1; i <= 2; i++) {
		var element = document.getElementById('dice' + i);
		if (element) {
			element.textContent = '';
		}
	}
}

var maxPlayers = 6;
var players = [];
var playing = -1;

(function () {
	function createScoreRow(index, name) {
		return createDom('tr', {}, [
			createDom('td', {}, createDom('span', {className: 'player' + index}, '👤')),
			createDom('td', {id: 'name' + index}, createDom('input', {size: 10, value: name || ''})),
			createDom('td', {id: 'money' + index, className: 'money'}),
			createDom('td', {id: 'playLink' + index}),
		]);
	}

	var board = document.body.appendChild(createDom('div', {id: 'board'}));

	var scoreTable = board.appendChild(createDom('table', {id: 'score'}));
	var defaultNames = ['Jakub', 'Kryštof', 'Prokop', 'Jana'];
	for (var i = 0; i < maxPlayers; i++) {
		scoreTable.appendChild(createScoreRow(i, defaultNames[i]));
	}
	document.getElementById('playLink' + (maxPlayers - 1)).appendChild(createDom('span', {id: 'playLink'}, [
		createDom('button', {}, translate('Play')), ' [Space]',
	]));

	board.appendChild(createDom('div', {className: 'restart'}, [
		createDom('button', {id: 'undo'}, translate('Undo')),
		createDom('button', {id: 'restart'}, translate('Restart')),
	]));
	board.appendChild(createDom('div', {className: 'buttons'}, [
		createDom('button', {className: 'confirm'}, translate('Confirm')), ' [Enter]',
		createDom('button', {className: 'cancel', disabled: true}, translate('Cancel')), ' [Esc]',
	]));
	board.appendChild(createDom('div', {id: 'dice'}, createDom('span', {id: 'dice1'})));
	board.appendChild(createDom('div', {id: 'message'}));

	for (var i = 0, field; field = fields[i]; i++) {
		field.index = i;
		var pos = position(i);
		var style = {top: pos.top + 'px', left: pos.left + 'px'};
		if (field.color) {
			style.borderTopColor = field.color;
		}
		field.div = createDom('div', {
			className: 'field',
			style: style,
			innerHTML: field.name + (field.price ? ' (' + field.price + ')' : '') + '<br><span class=earns>' + (field.getEarns ? field.getEarns() : field.earns || '') + '</span>',
			onclick: field.onclick,
		});
		field.div.style.top = pos.top + 'px';
		field.div.style.left = pos.left + 'px';
		board.appendChild(field.div);
	}
})();
