(function () {
	var board = document.getElementById('board');
	var maxX;
	var maxY;
	var time = Date.now();
	var step = 0;
	var speed = 10;

	window.onresize = function () {
		maxX = board.clientWidth / 5;
		maxY = board.clientHeight / 5;
	};
	window.onresize();
	
	function createSnake(x, y, angle, keyLeft, keyRight, keyBoost, className) {
		return {
			x: x,
			y: y,
			angle: angle,
			speed: 1,
			keyLeft: keyLeft,
			keyRight: keyRight,
			keyBoost: keyBoost,
			className: className,
			points: createPoints(x, y, className),
			invincible: 0,
		};
	}
	
	function createPoints(x, y, className) {
		var points = [];
		var length = 30;
		for (var i = 0; i < length; i++) {
			points.push(createPoint(x - length + i + 1, y, 'point ' + className));
		}
		updateScore(className, points.length);
		return points;
	}
	
	function randomX() {
		return Math.round(Math.random() * maxX);
	}
	
	function randomY() {
		return Math.round(Math.random() * maxY);
	}
	
	var Keys = {
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		A: 65,
		B: 66,
		M: 77,
		N: 78,
		X: 88,
		Z: 90,
	};

	var snakes = [
		createSnake(40, 40, 0, Keys.LEFT, Keys.RIGHT, Keys.UP, ''),
		createSnake(40, 60, 0, Keys.Z, Keys.X, Keys.A, 'snake2'),
		createSnake(40, 80, 0, Keys.N, Keys.M, Keys.B, 'snake3'),
	];
	
	var foods = [];
	for (var i = 0; i < 10; i++) {
		var point = createPoint(randomX(), randomY(), 'food');
		foods.push(point);
	}

	loop();
	
	function createPoint(x, y, className) {
		var point = {point: document.createElement('div')};
		point.point.className = className;
		putPoint(point, x, y);
		board.appendChild(point.point);
		return point;
	}
	
	var pressedKeys = {};
	
	document.body.onkeyup = function(event) {
		delete pressedKeys[event.keyCode];
	};
	
	document.body.onkeydown = function(event) {
		pressedKeys[event.keyCode] = true;
	}
	
	function changeAngle(snake, delta) {
		snake.angle = (snake.angle + 10 * delta + 360) % 360;
	}
	
	function collides(point, x, y, delta) {
		return Math.abs(x - getX(point)) < delta && Math.abs(y - getY(point)) < delta;
	}
	
	function putPoint(point, x, y) {
		point.x = x;
		point.y = y;
		point.point.style.marginLeft = 5 * x + 'px';
		point.point.style.marginTop = 5 * y + 'px';
	}
	
	function removePoint(point, x, y) {
		if (point.point.parentElement) {
			point.point.parentElement.removeChild(point.point);
		}
	}
	
	function getX(point) {
		return point.x;
	}
	
	function getY(point) {
		return point.y;
	}
	
	function die(snake) {
		for (var i = 0, point; point = snake.points[i]; i++) {
			if (i % 10 == 0) {
				point.point.className = 'food';
				point.fromDead = true;
				foods.push(point);
			} else {
				removePoint(point);
			}
		}
		snake.x = randomX();
		snake.y = randomY();
		snake.angle = 0;
		snake.invincible = 10;
		snake.points = createPoints(snake.x, snake.y, snake.className);
	}
	
	function moveSnake(snake) {
		snake.speed = 1;
		for (var keyCode in pressedKeys) {
			if (keyCode == snake.keyLeft) {
				changeAngle(snake, -1);
			} else if (keyCode == snake.keyRight) {
				changeAngle(snake, 1);
			}
			if (keyCode == snake.keyBoost) {
				snake.speed = 2;
			}
		}
		snake.x = (snake.x + Math.cos(snake.angle / 180 * Math.PI) * snake.speed + maxX) % maxX;
		snake.y = (snake.y + Math.sin(snake.angle / 180 * Math.PI) * snake.speed + maxY) % maxY;
		if (snake.invincible) {
			snake.invincible--;
		}
		
		if (!snake.invincible) {
			for (var i = 0; i < snakes.length; i++) {
				if (snake != snakes[i] && !snakes[i].invincible) {
					for (var j = 0; j < snakes[i].points.length; j++) {
						if (collides(snakes[i].points[j], snake.x, snake.y, 1)) {
							die(snake);
							return;
						}
					}
				}
			}
		}
		
		if (snake.speed > 1 && snake.points.length > 1 && step % 5 == 0) {
			var food = snake.points.shift();
			if (step % 10 == 0) {
				food.fromDead = true;
				food.point.className = 'food';
				foods.push(food);
			} else {
				removePoint(food);
			}
		}
		
		var ate = 0;
		for (var i = 0, food; food = foods[i]; i++) {
			if (food && collides(food, snake.x, snake.y, 2)) {
				if (!food.fromDead) {
					putPoint(food, randomX(), randomY());
					ate += 2;
				} else {
					removePoint(food);
					ate++;
				}
			}
		}
		var point = snake.points.shift();
		if (!point) {
			return;
		}
		for (var i = 0; i < ate; i++) {
			snake.points.unshift(createPoint(getX(point), getY(point), 'point ' + snake.className));
		}
		putPoint(point, snake.x, snake.y);
		snake.points.push(point);
		updateScore(snake.className, snake.points.length);
	}
	
	function updateScore(className, score) {
		document.querySelector('.score' + (className ? '.' + className : '')).textContent = score;
	}
	
	function loop() {
		for (var i = 0, snake; snake = snakes[i]; i++) {
			moveSnake(snake);
		}
		step++;
		var oldTime = time;
		time = Date.now();
		window.setTimeout(loop, 1000 / speed + oldTime - time);
	}
})();
