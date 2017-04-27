function runTests(tests) {
	for (var i = 0, test; test = tests[i]; i++) {
		try {
			setUp();
			test();
			var p = document.createElement('p');
			p.style.color = 'green';
			p.textContent = test.name + ' passed.';
			document.getElementById('tests').appendChild(p);
		} catch (ex) {
			var pre = document.createElement('pre');
			pre.style.color = 'red';
			pre.textContent = ex.stack;
			document.getElementById('tests').appendChild(pre);
			console.log(ex);
		}
	}
}

function assertEquals(expected, actual) {
	if (expected !== actual) {
		throw Error(actual + ' should be ' + expected + '.');
	}
}
