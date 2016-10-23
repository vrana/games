var MIN_SPEED = -2;
var MAX_SPEED = 10;
var ACCELERATION = .5;
var DECELERATION = .2;
var REFRESH = 50; // ms

var Keys = {
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	Z: 90,
	C: 67,
	S: 83,
	X: 88
};

function createKart(x, y, angle, keyLeft, keyRight, keyUp, keyDown) {
	return {
		x: x,
		y: y,
		angle: angle,
		speed: 0,
		reverse: true,
		checkPoint: true,
		startLap: 0,
		keyLeft: keyLeft,
		keyRight: keyRight,
		keyUp: keyUp,
		keyDown: keyDown,
		engineSound: newAudio('engine.mp3'),
		tyreSound: newAudio('tyre.mp3')
	};
}

function newAudio(src) {
	var audio = new Audio(src);
	audio.loop = true;
	audio.preload = 'auto';
	return audio;
}

var pressedKeys = {};
var time = Date.now();
var start = time;
var karts = [
	createKart(500, 100, 0, Keys.LEFT, Keys.RIGHT, Keys.UP, Keys.DOWN),
	createKart(500, 60, 0, Keys.Z, Keys.C, Keys.S, Keys.X)
];

document.body.onkeydown = function (event) {
	pressedKeys[event.keyCode] = true;
};

document.body.onkeyup = function(event) {
	delete pressedKeys[event.keyCode];
};

function changeAngle(kart, delta) {
	kart.angle = (kart.angle + 10 * delta + 360) % 360;
}

function playOrStop(audio, play) {
	if (play) {
		audio.play();
	} else {
		audio.currentTime = 0;
		audio.pause();
	}
}

function moveKart(id, kart) {
	var el = document.getElementById(id);
	var speed = kart.speed;
	var steering = false;
	
	for (var keyCode in pressedKeys) {
		if (keyCode == kart.keyLeft) {
			changeAngle(kart, -.5);
			steering = true;
		} else if (keyCode == kart.keyRight) {
			changeAngle(kart, .5);
			steering = true;
		} else if (keyCode == kart.keyUp) {
			speed = Math.min(speed + ACCELERATION, MAX_SPEED);
		} else if (keyCode == kart.keyDown) {
			speed = Math.max(speed - ACCELERATION, kart.reverse ? MIN_SPEED : 0);
		}
	}
	if (speed > 0) {
		kart.reverse = false;
		speed = Math.max(speed - DECELERATION, 0);
	} else {
		speed = Math.min(speed + DECELERATION, 0);
	}
	if (!speed) {
		if (!pressedKeys[kart.keyDown]) {
			kart.reverse = true;
		}
	}
	var x;
	var y;
	for (var i = Math.abs(speed); i >= -ACCELERATION; i -= ACCELERATION) {
		x = kart.x + (i < 0 ? 0 : (kart.reverse ? -i : i)) * Math.cos(kart.angle / 180 * Math.PI);
		y = kart.y + (i < 0 ? 0 : (kart.reverse ? -i : i)) * Math.sin(kart.angle / 180 * Math.PI);
		if (isKartCollision(x, y)) {
			speed = 0;
		} else {
			break;
		}
	}
	
	playOrStop(kart.engineSound, speed);
	playOrStop(kart.tyreSound, steering);
	
	kart.x = x;
	kart.y = y;
	kart.speed = speed;
	
	if (x < 300 && y > 500) {
		kart.checkPoint = true;
	} else if (x > 600 && y < 110) {
		if (kart.checkPoint) {
			if (kart.startLap) {
				var previousLaps = document.getElementById(id + '-previousLaps');
				previousLaps.innerHTML = ((time - kart.startLap) / 1000).toFixed(3) + ' s<br>' + previousLaps.innerHTML;
			}
			kart.checkPoint = false;
			kart.startLap = time;
		}
	}
	if (kart.startLap) {
		document.getElementById(id + '-currentLap').textContent = ((time - kart.startLap) / 1000).toFixed(3) + ' s';
	}
	
	el.style.left = x + 'px';
	el.style.top = y + 'px';
	el.style.transform = 'rotate(' + kart.angle + 'deg)';
}

function isCollision(x, y) {
	return ctx.getImageData(x, y, 1, 1).data[0] != 255;
}

function isKartCollision(x, y) {
	return isCollision(x + 25, y) || isCollision(x + 25, y + 40) || isCollision(x + 5, y + 20) || isCollision(x + 45, y + 20);
}

function loop() {
	for (var i = 0; i < karts.length; i++) {
		moveKart('kart' + i, karts[i]);
	}
	var oldTime = time;
	time = Date.now();
	setTimeout(loop, REFRESH + oldTime - time);
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'navy';
ctx.fillRect(0, 0, canvas.width, canvas.height);

/*
// track
ctx.moveTo(200, 100);
ctx.arcTo(800, 100, 800, 200, 100);
ctx.arcTo(800, 550, 600, 550, 100);
ctx.arcTo(600, 550, 600, 450, 100);
ctx.arcTo(600, 250, 450, 250, 150);
ctx.arcTo(300, 250, 300, 400, 150);
ctx.arcTo(300, 550, 200, 550, 100);
ctx.arcTo(100, 550, 100, 450, 100);
ctx.arcTo(100, 100, 200, 100, 100);
ctx.lineWidth = 100;
ctx.strokeStyle = 'white';
ctx.stroke();
*/

// outside
ctx.moveTo(50, 150);
ctx.arcTo(50, 600, 150, 600, 100);
ctx.arcTo(350, 600, 350, 500, 100);
ctx.arcTo(350, 300, 450, 300, 100);
ctx.arcTo(550, 300, 550, 400, 100);
ctx.arcTo(550, 600, 650, 600, 100);
ctx.arcTo(850, 600, 850, 500, 100);
ctx.arcTo(850, 50, 750, 50, 100);
ctx.arcTo(50, 50, 50, 150, 100);
ctx.fillStyle = 'white';
ctx.fill();

// inside
ctx.beginPath();
ctx.moveTo(150, 200);
ctx.arcTo(150, 500, 200, 500, 50);
ctx.arcTo(250, 500, 250, 450, 50);
ctx.arcTo(250, 200, 400, 200, 150);
ctx.arcTo(650, 200, 650, 350, 150);
ctx.arcTo(650, 500, 700, 500, 50);
ctx.arcTo(750, 500, 750, 450, 50);
ctx.arcTo(750, 150, 700, 150, 50);
ctx.arcTo(150, 150, 150, 200, 50);
ctx.fillStyle = 'navy';
ctx.fill();

// starting line
ctx.beginPath();
ctx.moveTo(650, 50);
ctx.lineTo(650, 150);
ctx.strokeStyle = 'red';
ctx.stroke();

loop();
