(function () {
	var currentCard;
	var hand = {};

	var conn = new WebSocket('ws://192.168.0.100:3255');
	conn.onmessage = function (e) {
		var msg = JSON.parse(e.data);
		document.getElementById('message').innerHTML = msg.message;
		if (msg.start) {
			document.getElementById('upcard').innerHTML = '';
			document.getElementById('hand').innerHTML = '';
			document.getElementById('suits').style.display = 'none';
		}
		if (msg.sound && window.Audio) {
			var audio = new Audio('sounds/' + msg.sound + '.mp3');
			audio.play();
		}
		if (msg.cards) {
			for (var i = 0; i < msg.cards.length; i++) {
				var card = msg.cards[i];
				var img = document.createElement('img');
				img.src = 'cards/card' + card + '.png';
				img.card = card;
				img.onclick = cardClick;
				document.getElementById('hand').appendChild(img);
				hand[card] = img;
			}
		}
		if ('upcard' in msg && msg.upcard != 32) {
			var img = document.createElement('img');
			img.src = 'cards/card' + msg.upcard + '.png';
			var transform = 'rotate(' + Math.round(Math.random() * 14 - 7) + 'deg)';
			img.style.transform = transform;
			document.getElementById('upcard').appendChild(img);
			if (msg.upcard in hand) {
				hand[msg.upcard].parentElement.removeChild(hand[msg.upcard]);
				delete hand[msg.upcard];
			}
			if ('suit' in msg) {
				var img = document.createElement('img');
				img.src = 'cards/suit' + msg.suit + '.png';
				img.className = 'suit';
				img.style.transform = transform;
				document.getElementById('upcard').appendChild(img);
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
			send(currentCard);
		}
	}

	function isQueen(card) {
		return (card % 8 == 5);
	}

	function suitClick(event) {
		document.getElementById('suits').style.display = 'none';
		send(currentCard + event.target.suit);
	}
	
	function send(card) {
		document.getElementById('message').innerHTML = 'Sending';
		conn.send(card);
	}

	document.getElementById('topdeck').card = 32;
	document.getElementById('topdeck').onclick = cardClick;
	var imgs = document.getElementById('suits').getElementsByTagName('img');
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].suit = String.fromCharCode('a'.charCodeAt(0) + i);
		imgs[i].onclick = suitClick;
	}
})();
