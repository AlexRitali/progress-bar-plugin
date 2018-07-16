let keys = 'qwertyuiop,asdfghjkl,zxcvbnm';
let chars = [];

function setup() {
	let now = performance.now();
	let isPreview = isPreviewEmbed();
	let rowOffsetsX = [ 0, 0.3, 0.8 ];
	keys = keys.split(',').map((row, rowIndex) => {
			return row.split('').map((n, i) => {
				let rowOffsetX = rowOffsetsX[rowIndex];
				let x = rowOffsetX + i + 0.5;
				let y = rowIndex + 0.5;
				let pos = createVector(x, y);
				let dist = ease.cubic.in(pos.dist(createVector()) / (SQRT2 * 8), 0, 1, 1);
				let c = {
						char: n.toUpperCase(),
						key: n,
						keyPressed: false,
						keyReleased: -Infinity,
						pos,
						dist
					};
				if(isPreview) {
					setTimeout(() => c.keyReleased = performance.now(), dist * 500 + 50 + now);
					setTimeout(() => c.keyReleased = performance.now(), dist * 500 + 300 + now);
				}
				chars.push(c);
				return c;
			});
		});
	window.addEventListener('keydown', e => {
		let char = chars.find(n => n.key === e.key.toLowerCase());
		if(char) {
			char.keyPressed = true;
		}
	});
	window.addEventListener('keyup', e => {
		let char = chars.find(n => n.key === e.key.toLowerCase());
		if(char) {
			char.keyPressed = false;
			char.keyReleased = e.timeStamp;
		}
	});
}

function draw(e) {
	let maxRowLength = keys[0].length;
	let size = width / maxRowLength * 0.8;
	let size_half = size * 0.5;
	translate(
		// keys.reduce((p, n) => p.length > n.length ? p : n).length * 50 * -0.5,
		maxRowLength * -size_half,
		keys.length * -size_half
	);
	
	textAlign('center');
	textBaseline('middle');
	
	keys.forEach((row, rowIndex) => {
		row.forEach(({ char, keyPressed, keyReleased, pos: v }, i) => {
			let pos = v.copy().mult(size);
			globalAlpha(1);
			let timeDiff = ease.cubic.in(1 - constrain(keyPressed ? 0 : (e - keyReleased) * 0.001, 0, 1), 0, 1, 1);
			fillStyle(rgb(lerpRGB(0, 127, 255, 255, 255, 255, timeDiff)));
			let scl = timeDiff + 1;
			font(`800 ${scl * size_half}px sans-serif`);
			fillText(char, pos.x, pos.y);
			globalAlpha(timeDiff * 0.15 + 0.05);
			beginPath();
			let s = size * scl * 0.75;
			rect(pos.x - s * 0.5, pos.y - s * 0.5, s, s, s * 0.1);
			fill();
		});
	});
}
