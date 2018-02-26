(function () {
	var currentCard;
	var hand = {};

	var server = (window.URL ? new URL(document.location).searchParams.get('server') : null);
	var conn = new WebSocket('ws://' + (server || '192.168.0.100:3255'));
	conn.onmessage = function (e) {
		var msg = JSON.parse(e.data);
		document.getElementById('message').innerHTML = msg.message;
		if (msg.start) {
			document.getElementById('upcard').innerHTML = '';
			document.getElementById('hand').innerHTML = '';
			document.getElementById('suits').style.display = 'none';
			var players = document.getElementById('players').tBodies[0];
			players.innerHTML = '';
			for (var i = 1; i < msg.start; i++) {
				var imgs = [];
				for (var j = 0; j < 4; j++) {
					imgs.push(createDom('img', {'src': 'cards/card32.png'}));
				}
				players.appendChild(createDom('tr', {}, [
					createDom('td'),
					createDom('td', {}, 'Player ' + (i + 1)),
					createDom('td', {}, imgs)
				]));
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
	};

	function cardClick(event) {
		currentCard = event.target.card;
		if (isQueen(currentCard)) {
			document.getElementById('suits').style.display = 'block';
		} else {
			document.getElementById('suits').style.display = 'none';
			send({'card': currentCard});
		}
	}

	function isQueen(card) {
		return (card % 8 == 5);
	}

	function suitClick(event) {
		document.getElementById('suits').style.display = 'none';
		send({'card': currentCard, 'suit': event.target.suit});
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
})();
