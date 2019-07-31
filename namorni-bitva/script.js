function rand(n) {
	return Math.floor(Math.random() * n);
}

function placeBoats(field, boats) {
	for (let boat of boats) {
		do {
			var y = rand(field.length - boat.length + 1);
			var x = rand(field[y].length);
		} while (!placeBoat(field, boat, x, y));
	}
}

function placeBoat(field, boat, x, y, place = false) {
	for (let j=0; j < boat.length; j++) {
		for (let i=0, row = boat[j]; row; i++) {
			if (row & 1) { // The bit for this column is set.
				if (place) {
					field[y+j][x+i] = 1;
				} else { // We are checking if the boat can be placed.
					if (x + i >= field[y+j].length) {
						return false; // The boat is outside the field.
					}
					for (let n=0; n < 9; n++) {
						if (!isEmpty(field, x + i + n%3 - 1, y + j + Math.floor(n/3) - 1)) {
							return false; // There's something around this point.
						}
					}
				}
			}
			row = row >> 1;
		}
	}
	if (!place) { // Checks passed, place the boat.
		placeBoat(field, boat, x, y, true);
	}
	return true;
}

function createField() {
	let field = new Array(10);
	for (let j=0; j < field.length; j++) {
		field[j] = new Array(10);
	}
	placeBoats(field, boats);
	return field;
}

// Array of rows. Value is big-endian bits of the columns.
let boat1 = [1];
let boat2 = [3];
let boat2b = [1, 1];
let boat3 = [7];
let boat3b = [1, 1, 1];
let boat4 = [15];
let boats = [boat4, boat3, boat3b, boat2, boat2b, boat2b, boat1, boat1, boat1, boat1];

let meField = createField();
let youField = createField();

for (let j=0; j < meField.length; j++) {
	for (let i=0; i < meField[j].length; i++) {
		if (meField[j][i]) {
			setClassName('#me', i, j, 'boat');
		}
	}
}

document.querySelector('#you table').onclick = function (event) {
	var target = event.target;
	if (target.tagName != 'TD') {
		return;
	}
	let y = index(target.parentNode);
	let x = index(target);
	shoot(youField, x, y, '#you');
	do {
		y = rand(meField.length);
		x = rand(meField[y].length);
	} while (meField[y][x] === '' || meField[y][x] === 'hit');
	shoot(meField, x, y, '#me');
};

function shoot(field, x, y, id) {
	if (field[y][x]) {
		setFieldAndClassName(field, id, x, y, 'hit');
	} else {
		setFieldAndClassName(field, id, x, y, 'water');
		for (let i=1; i < field.length; i++) {
			if (!isEmpty(field, x+i, y) || !isEmpty(field, x-i, y) || !isEmpty(field, x, y+i) || !isEmpty(field, x, y-i)) {
				break;
			}
			setFieldAndClassName(field, id, x+i, y, 'water');
			setFieldAndClassName(field, id, x-i, y, 'water');
			setFieldAndClassName(field, id, x, y+i, 'water');
			setFieldAndClassName(field, id, x, y-i, 'water');
		}
	}
}

function setFieldAndClassName(field, id, x, y, className) {
	if (field[y] && x < field[y].length) {
		field[y][x] = className == 'water' ? '' : className;
	}
	setClassName(id, x, y, className);
}

function setClassName(id, x, y, className) {
	var row = document.querySelectorAll(id + ' tr').item(y);
	if (row) {
		var cell = row.querySelectorAll('td').item(x);
		if (cell) {
			cell.className = className;
		}
	}
}

function isEmpty(field, x, y) {
	let row = field[y];
	return !row || !row[x];
}

function index(element) {
	let i = 0;
	for (let candidate of element.parentNode.children) {
		if (candidate == element) {
			return i;
		}
		i++;
	}
	return -1;
}
