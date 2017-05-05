function runTests(tests) {
	for (var i = 0, test; test = tests[i]; i++) {
		try {
			setUp();
			test();
			var p = createDom('p', {style: 'color: green'}, test.name + ' passed.');
			document.getElementById('tests').appendChild(p);
		} catch (ex) {
			var p = createDom('p', {style: 'color: red'}, test.name + ' failed:');
			document.getElementById('tests').appendChild(p);
			var pre = createDom('pre', {}, ex.stack);
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
