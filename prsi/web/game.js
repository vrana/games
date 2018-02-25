(function () {
	var currentCard;
	var hand = {};

	var server = (window.URL ? new URL(document.location).searchParams.get('server') : null);
	var conn = new WebSocket('ws://' + (server || location.hostname || '192.168.0.100') + ':3255');
	var playing;
	conn.onmessage = function (e) {
		var msg = JSON.parse(e.data);
		if (msg.message) {
			document.getElementById('message').innerHTML = msg.message;
		}
		if (msg.start) {
			document.getElementById('upcard').innerHTML = '';
			document.getElementById('hand').innerHTML = '';
			document.getElementById('suits').style.display = 'none';
			hand = {};
			playing = 0;
			var players = document.getElementById('players').tBodies[0];
			players.innerHTML = '';
			for (var i = 1; i < msg.start; i++) {
				players.appendChild(createDom('tr', {}, [
					createDom('td'),
					createDom('td'),
					createDom('td')
				]));
				renderCount(i, 4);
			}
		}
		if (msg.sound && window.Audio) {
			var audio = new Audio('sounds/' + msg.sound + '.mp3');
			audio.play();
		}
		if (msg.cards) {
			for (var i = 0; i < msg.cards.length; i++) {
				var card = msg.cards[i];
				var img = createDom('img', {src: 'cards/card' + card + '.png', card: card, onclick: cardClick});
				document.getElementById('hand').appendChild(img);
				hand[card] = img;
			}
		}
		if ('upcard' in msg && msg.upcard != 32) {
			var transform = 'transform: rotate(' + Math.round(Math.random() * 14 - 7) + 'deg);';
			document.getElementById('upcard').appendChild(createDom('img', {src: 'cards/card' + msg.upcard + '.png', style: transform}));
			if (msg.upcard in hand) {
				hand[msg.upcard].parentElement.removeChild(hand[msg.upcard]);
				delete hand[msg.upcard];
			}
			if ('suit' in msg) {
				document.getElementById('upcard').appendChild(createDom('img', {src: 'cards/suit' + msg.suit + '.png', className: 'suit', style: transform}));
			}
		}
		if ('action' in msg) {
			document.getElementById('action').innerHTML = (msg.action ? msg.action : '&nbsp;');
		}
		if ('count' in msg && playing) {
			renderCount(playing, msg.count);
		}
		if ('playing' in msg) {
			document.getElementById('players').rows[playing].firstChild.textContent = '';
			playing = msg['playing'];
			document.getElementById('players').rows[playing].firstChild.textContent = '➡';
		}
		if ('names' in msg) {
			for (var key in msg.names) {
				document.getElementById('players').rows[key].cells[1].textContent = msg.names[key];
			}
		}
	};
	
	function renderCount(row, count) {
		var td = document.getElementById('players').rows[row].cells[2];
		td.innerHTML = '';
		for (var j = 0; j < count; j++) {
			td.appendChild(createDom('img', {'src': 'cards/card32.png'}));
		}
	}

	function cardClick(event) {
		currentCard = event.target.card;
		if (isQueen(currentCard)) {
			document.getElementById('suits').style.display = 'block';
		} else {
			document.getElementById('suits').style.display = 'none';
			send({card: currentCard});
		}
	}

	function isQueen(card) {
		return (card % 8 == 5);
	}

	function suitClick(event) {
		document.getElementById('suits').style.display = 'none';
		send({card: currentCard, suit: event.target.suit});
	}
	
	function send(data) {
		document.getElementById('message').innerHTML = 'Sending';
		conn.send(JSON.stringify(data));
	}

	function createDom(tag, attributes, content) {
		var el = document.createElement(tag);
		for (var key in attributes || {}) {
			el[key] = attributes[key];
		}
		var contents = (content instanceof Array ? content : [content]);
		for (var i = 0; content = contents[i]; i++) {
			el.appendChild(typeof content == 'string' ? document.createTextNode(content) : content);
		}
		return el;
	}
	
	document.getElementById('topdeck').card = 32;
	document.getElementById('topdeck').onclick = cardClick;
	var imgs = document.getElementById('suits').getElementsByTagName('img');
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].suit = String.fromCharCode('a'.charCodeAt(0) + i);
		imgs[i].onclick = suitClick;
	}
	
	document.getElementById('name').value = sessionStorage.getItem('name') || localStorage.getItem('name');
	document.getElementById('name').onchange = function () {
		sessionStorage.setItem('name', this.value);
		localStorage.setItem('name', this.value);
		conn.send(JSON.stringify({name: this.value}));
	};
	conn.onopen = function () {
		var name = sessionStorage.getItem('name') || localStorage.getItem('name');
		if (name) {
			conn.send(JSON.stringify({name: name}));
		}
	};
	
	conn.onclose = function (event) {
		document.getElementById('message').innerHTML = 'Server not connected.';
	};
})();
