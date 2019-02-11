var playing;
var round;

function rand(max) {
	return Math.floor(Math.random() * max);
}

document.querySelector('#play').onclick = function () {
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
	document.querySelector('tbody').rows[playing].cells[0].textContent = '➜';
	document.querySelector('table').rows[0].cells[0].textContent = '';
	play();
	document.querySelector('#play').onclick = roll;
};

document.querySelector('#dices').onclick = function (event) {
	if (round != 3 && event.target.tagName == 'A') {
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
		case '3+2': return setUnpinnedMin(3);
		case '4+1': return setUnpinnedMin(4);
	}
}

function setUnpinnedSet(need) {
	var dices = document.querySelectorAll('#dices a');
	for (var i=0; i < dices.length; i++) {
		dices[i].classList.toggle('unpinned', !need.delete(diceValue(dices[i])));
	}
	if (round == 3 && need.size) {
		for (var i=0; i < dices.length; i++) {
			dices[i].classList.add('unpinned');
		}
	}
}

function setUnpinnedMin(min) {
	var dices = document.querySelectorAll('#dices a');
	var counts = {};
	for (var i=0; i < dices.length; i++) {
		counts[diceValue(dices[i])] = (counts[diceValue(dices[i])] || 0) + 1;
	}
	var values = Object.values(counts);
	if (round == 3) {
		var pinned = (values.length == 1 || values.length == 2 && (values[0] == min || values[1] == min));
		for (var i=0; i < dices.length; i++) {
			dices[i].classList.toggle('unpinned', !pinned);
		}
	} else {
		for (var i=0; i < dices.length; i++) {
			dices[i].classList.toggle('unpinned', counts[diceValue(dices[i])] < min - 1 || min == 4 && values.length == 1 && i == dices.length - 1);
		}
	}
}

function play() {
	var dices = document.querySelectorAll('#dices a');
	for (var i=0; i < dices.length; i++) {
		dices[i].classList.add('unpinned');
	}
	round = 0;
	document.querySelector('tbody').rows[playing].classList.add('playing');
	roll();
}

function roll() {
	var unpinned = document.querySelectorAll('#dices a.unpinned');
	var picked = document.querySelector('.picked');
	if (round == 3 || picked && !unpinned.length) {
		if (round < 3) {
			round = 3;
			setUnpinned(picked);
			compute();
		}
		play();
	} else if (!unpinned.length) {
		alert('Vyberte kostky, kterými chcete hodit.');
	} else if (round == 2 && !picked) {
		alert('Vyberte kombinaci, kterou chcete hodit.');
	} else {
		for (var i=0; i < unpinned.length; i++) {
			unpinned[i].textContent = String.fromCharCode('⚀'.charCodeAt(0) + rand(6));
			unpinned[i].classList.remove('unpinned');
			unpinned[i].style.transform = 'rotate(' + (Math.random() * 30 - 15) + 'deg)';
		}
		round++;
		if (picked) {
			setUnpinned(picked);
		}
		if (round == 3) {
			compute();
		}
	}
}

function compute() {
	var dices = document.querySelectorAll('#dices a');
	var score = 0;
	for (var i = 0; i < dices.length; i++) {
		if (!dices[i].classList.contains('unpinned')) {
			score += diceValue(dices[i]);
		}
	}
	document.querySelector('.picked').textContent += score;
	var total = document.querySelector('.playing th:last-child');
	total.textContent = +total.textContent + score;
	document.querySelector('.picked').classList.add('played');
	document.querySelector('.picked').classList.remove('picked');
	document.querySelector('.playing').classList.remove('playing');
	document.querySelector('tbody').rows[playing].cells[0].textContent = '';
	playing = (playing + 1) % document.querySelector('tbody').rows.length;
	var row = document.querySelector('tbody').rows[playing];
	if (row.querySelectorAll('td.played').length == row.querySelectorAll('td').length) {
		end();
	} else {
		document.querySelector('tbody').rows[playing].cells[0].textContent = '➜';
	}
}

function end() {
	document.querySelector('#play').remove();
	var rows = document.querySelector('tbody').rows;
	var max = 0;
	for (var i = 0; i < rows.length; i++) {
		max = Math.max(max, rows[i].cells[rows[i].cells.length - 1].textContent);
	}
	for (var i = 0; i < rows.length; i++) {
		if (max == rows[i].cells[rows[i].cells.length - 1].textContent) {
			document.querySelector('tbody').rows[i].cells[0].textContent = '➜';
		}
	}
}
