var playing = 'x';

document.getElementById('field').onclick = function (event) {
	if (event.target.tagName == 'TD' && !event.target.textContent) {
		event.target.textContent = playing;
		if (find5(event.target, 0, 1) || find5(event.target, 1, 1) || find5(event.target, 1, 0) || find5(event.target, 1, -1)) {
			document.getElementById('status').textContent = playing + ' won.';
			document.getElementById('field').onclick = function () {};
		}
		playing = (playing == 'x' ? 'o' : 'x');
	}
};

function find5(td, dx, dy) {
	return findLength(td, dx, dy) + findLength(td, -dx, -dy) >= 4;
}

function findLength(td, dx, dy) {
	var tr = td.parentNode;
	var tbody = tr.parentNode;
	var x = indexOf(tr.cells, td) + dx;
	var y = indexOf(tbody.rows, tr) + dy;
	var result = 0;
	while (tbody.rows[y] && tbody.rows[y].cells[x] && tbody.rows[y].cells[x].textContent == td.textContent) {
		result++;
		x += dx;
		y += dy;
	}
	return result;
}

function indexOf(collection, item) {
	for (var i = 0; i < collection.length; i++) {
		if (collection[i] == item) {
			return i;
		}
	}
	return -1;
}
