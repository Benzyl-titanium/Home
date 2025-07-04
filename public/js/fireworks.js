function clickEffect() {
	if (window.__fireworks_inited) {
		return;
	}
	window.__fireworks_inited = true;
	const canvasId = "__fireworks_canvas";
	const pointerId = "__fireworks_pointer";
	if (document.getElementById(canvasId)) return;
	const balls = [];
	let longPressed = false;
	let longPress;
	let multiplier = 0;
	let width;
	let height;
	let origin;
	let normal;
	let ctx;
	const MAX_BALLS = 100;

	const canvas = document.createElement("canvas");
	canvas.id = canvasId;
	document.body.appendChild(canvas);
	canvas.setAttribute(
		"style",
		"width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;",
	);
	const pointer = document.createElement("span");
	pointer.id = pointerId;
	pointer.classList.add("pointer");
	document.body.appendChild(pointer);

	function isDarkMode() {
		return document.documentElement.classList.contains("dark");
	}

	if (canvas.getContext && window.addEventListener) {
		ctx = canvas.getContext("2d");
		updateSize();
		window.addEventListener("resize", updateSize, false);
		loop();
		window.addEventListener(
			"mousedown",
			(e) => {
				pushBalls(randBetween(10, 20), e.clientX, e.clientY);
				document.body.classList.add("is-pressed");
				longPress = setTimeout(() => {
					document.body.classList.add("is-longpress");
					longPressed = true;
				}, 500);
			},
			false,
		);
		window.addEventListener(
			"mouseup",
			(e) => {
				clearInterval(longPress);
				if (longPressed === true) {
					document.body.classList.remove("is-longpress");
					pushBalls(
						randBetween(
							50 + Math.ceil(multiplier),
							100 + Math.ceil(multiplier),
						),
						e.clientX,
						e.clientY,
					);
					longPressed = false;
				}
				document.body.classList.remove("is-pressed");
			},
			false,
		);
		window.addEventListener(
			"mousemove",
			(e) => {
				const x = e.clientX;
				const y = e.clientY;
				pointer.style.top = `${y}px`;
				pointer.style.left = `${x}px`;
			},
			false,
		);
	} else {
		console.log("canvas or addEventListener is unsupported!");
	}

	function updateSize() {
		canvas.width = window.innerWidth * 2;
		canvas.height = window.innerHeight * 2;
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;
		ctx.scale(2, 2);
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		origin = {
			x: width / 2,
			y: height / 2,
		};
		normal = {
			x: width / 2,
			y: height / 2,
		};
	}

	class Ball {
		constructor(x = origin.x, y = origin.y) {
			this.x = x;
			this.y = y;
			this.angle = Math.PI * 2 * Math.random();
			if (longPressed === true) {
				this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
			} else {
				this.multiplier = randBetween(6, 12);
			}
			this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
			this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
			this.size = randBetween(10, 40) + 5 * Math.random();
			this.rotation = Math.random() * Math.PI * 2;
			this.rotationSpeed = (Math.random() - 0.5) * 0.2;
			this.opacity = 1.0;
			this.fadeSpeed = 0.02 + Math.random() * 0.03;
		}

		update() {
			this.x += this.vx - normal.x;
			this.y += this.vy - normal.y;
			normal.x = (-2 / window.innerWidth) * Math.sin(this.angle);
			normal.y = (-2 / window.innerHeight) * Math.cos(this.angle);
			this.size -= 0.5;
			this.rotation += this.rotationSpeed;
			this.opacity -= this.fadeSpeed;
			this.vx *= 0.9;
			this.vy *= 0.9;
		}

		draw() {
			if (this.opacity <= 0 || this.size <= 0) return;

			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);

			ctx.font = `${this.size}px sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			let hue = getComputedStyle(document.documentElement)
				.getPropertyValue("--hue")
				.trim();
			if (!hue) hue = "250"; // fallback
			const isDark = isDarkMode();
			const themeColor = `hsl(${hue}, 80%, ${isDark ? "85%" : "60%"})`;
			ctx.fillStyle = themeColor;
			ctx.fillText("⌬", 0, 0);

			ctx.restore();
		}
	}

	function pushBalls(count = 1, x = origin.x, y = origin.y) {
		const canAdd = Math.max(0, MAX_BALLS - balls.length);
		const addCount = Math.min(count, canAdd);
		for (let i = 0; i < addCount; i++) {
			balls.push(new Ball(x, y));
		}
	}

	function randBetween(min, max) {
		return Math.floor(Math.random() * max) + min;
	}

	function loop() {
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < balls.length; i++) {
			const b = balls[i];
			if (b.opacity <= 0 || b.size <= 0) continue;
			b.draw();
			b.update();
		}
		if (longPressed === true) {
			multiplier += 0.2;
		} else if (!longPressed && multiplier >= 0) {
			multiplier -= 0.4;
		}
		removeBall();
		requestAnimationFrame(loop);
	}

	function removeBall() {
		for (let i = 0; i < balls.length; i++) {
			const b = balls[i];
			if (
				b.x + b.size < 0 ||
				b.x - b.size > width ||
				b.y + b.size < 0 ||
				b.y - b.size > height ||
				b.opacity <= 0 ||
				b.size <= 0
			) {
				balls.splice(i, 1);
			}
		}
	}
}
clickEffect();
