var playing;
var round;

function rand(max) {
	return Math.floor(Math.random() * max);
}

document.querySelector('#play').onclick = function () {
	if (playing == undefined) {
		var tbody = document.querySelector('tbody');
		for (var i = tbody.rows.length - 1; i >= 0; i--) {
			var name = tbody.rows[i].cells[1].firstChild.value;
			if (!name) {
				tbody.rows[i].remove();
			} else {
				tbody.rows[i].cells[1].textContent = name;
			}
		}
		playing = rand(tbody.rows.length);
		tbody.rows[playing].cells[0].textContent = '➜';
		tbody.rows[playing].classList.add('playing');
		document.querySelector('table').rows[0].cells[0].textContent = '';
		play();
	} else {
		roll();
	}
};

document.querySelector('#dices').onclick = function (event) {
	if (event.target.tagName == 'A') {
		event.target.classList.toggle('unpinned');
	}
}

document.querySelector('table').onclick = function (event) {
	if (getComputedStyle(event.target).cursor == 'pointer') {
		var picked = document.querySelector('.picked');
		if (picked) {
			picked.classList.remove('picked');
		}
		event.target.classList.add('picked');
		setUnpinned(event.target);
	}
};

function diceValue(dice) {
	return dice.textContent.charCodeAt(0) - '⚀'.charCodeAt(0) + 1;
}

function setUnpinned(td) {
	var index = Array.from(td.parentElement.children).indexOf(td);
	var kind = document.querySelector('table').rows[0].cells[index].textContent;
	switch (kind) {
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
			var dices = document.querySelectorAll('#dices a');
			for (var i=0; i < dices.length; i++) {
				dices[i].classList.toggle('unpinned', diceValue(dices[i]) != kind);
			}
			return;
		case 'MŘ': return setUnpinnedSet(new Set([1, 2, 3, 4, 5]));
		case 'VŘ': return setUnpinnedSet(new Set([2, 3, 4, 5, 6]));
		case '3+2': return setUnpinnedMin(2);
		case '4+1': return setUnpinnedMin(3);
	}
}

function setUnpinnedSet(need) {
	var dices = document.querySelectorAll('#dices a');
	for (var i=0; i < dices.length; i++) {
		dices[i].classList.toggle('unpinned', !need.delete(diceValue(dices[i])));
	}
}

function setUnpinnedMin(min) {
	var dices = document.querySelectorAll('#dices a');
	var values = {};
	for (var i=0; i < dices.length; i++) {
		values[diceValue(dices[i])] = (values[diceValue(dices[i])] || 0) + 1;
	}
	for (var i=0; i < dices.length; i++) {
		dices[i].classList.toggle('unpinned', values[diceValue(dices[i])] < min);
	}
}

function play() {
	var dices = document.querySelectorAll('#dices a');
	for (var i=0; i < dices.length; i++) {
		dices[i].classList.add('unpinned');
	}
	round = 0;
	roll();
}

function roll() {
	var dices = document.querySelectorAll('#dices a.unpinned');
	var picked = document.querySelector('.picked');
	if (!dices.length) {
		alert('Vyberte kostky, kterými chcete hodit.');
	} else if (round == 2 && !picked) {
		alert('Vyberte kombinaci, kterou chcete hodit.');
	} else {
		for (var i=0; i < dices.length; i++) {
			dices[i].textContent = String.fromCharCode('⚀'.charCodeAt(0) + rand(6));
			dices[i].classList.remove('unpinned');
		}
		round++;
		if (picked) {
			setUnpinned(picked);
		}
	}
}
