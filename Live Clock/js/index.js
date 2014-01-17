var stage,
	minute,
	hour,
	second,
	container,
	startClock = false,
	soundPlugin = null;

function init() {
	document.addEventListener('click', startClockClick, false);

	var canvas = document.getElementById("clockCanvas"),
		windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		clockSize = 100;

	canvas.width = windowWidth;
	canvas.height = windowHeight;
	clockSize = (windowWidth > windowHeight) ? Math.floor(windowHeight / 4) : Math.floor(windowWidth / 4);

	stage = new createjs.Stage(canvas);
	container = stage.addChild(new createjs.Container());
	container.x = windowWidth / 2;
	container.y = windowHeight / 2;

	// create the clock minute markers
	for (deg = 0; deg <= 360; deg += 6) {
		var radius = 1;
		if (deg % 30 === 0) radius = 3;
		if (deg % 90 === 0) radius = 6;

		var point = new createjs.Shape();
		point.graphics.beginFill(randomColorGenerator()).drawCircle(clockSize, 0, radius);

		point.rotation = deg;
		container.addChild(point);
	}

	// the hour hand
	hour = new createjs.Shape();
	hour.graphics.beginFill(randomColorGenerator()).drawRect(0, 0, clockSize - 70, 5);
	container.addChild(hour);

	// the minute hand
	minute = new createjs.Shape();
	minute.graphics.beginFill(randomColorGenerator()).drawRect(0, 0, clockSize - 30, 3);
	container.addChild(minute);

	// the second hand
	second = new createjs.Shape();
	second.graphics.beginFill(randomColorGenerator()).drawRect(0, 0, clockSize - 15, 1);
	container.addChild(second);

	createjs.Ticker.addEventListener("tick", tick);
}

function tick() {
	var date = new Date();
	second.rotation = secToAngle(date) - 90;
	minute.rotation = minToAngle(date) - 90 + (6 * (secToAngle(date) / 360));
	hour.rotation = hourToAngle(date) - 90 + (30 * (minToAngle(date) / 360));
	stage.update();
	if (startClock === true) {
		soundPlugin.handleLoad();
	}
	if (startClock === false) {
		createjs.Ticker.removeEventListener("tick", tick);
	}
}

function randomColorGenerator() {
	return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
}

function minToAngle(date) {
	return date.getMinutes() * 6;
}

function hourToAngle(date) {
	return (date.getHours() - 12) * 30;
}

function secToAngle(date) {
	return date.getSeconds() * 6;
}

function startClockClick() {
	if (soundPlugin === null) {
		soundPlugin = new anonymousSpace.MyApp({
			'soundPath': 'ticksound.mp3'
		});
	} else {
		soundPlugin.init({
			'soundPath': 'ticksound.mp3'
		});
	}
	document.removeEventListener('click', startClockClick);
	createjs.Ticker.addEventListener("tick", tick);
	startClock = true;
}


this.anonymousSpace = this.anonymousSpace || {};
(function() {
	function MyApp(params) {
		this.init(params);
	}

	MyApp.prototype = {
		src: null,
		soundInstance: null,
		displayStatus: null,
		loadProxy: null,

		init: function(params) {
			if (!createjs.Sound.initializeDefaultPlugins()) {
				console.log('Sound plugin not initialized');
				return false;
			}
			this.src = params.soundPath;

			createjs.Sound.alternateExtensions = ["mp3"];
			createjs.Sound.addEventListener("fileload", this.loadProxy);
			createjs.Sound.registerSound(this.src);
			return this;
		},

		handleLoad: function() {
			this.soundInstance = createjs.Sound.play(this.src);
			// createjs.Sound.removeEventListener("fileload", this.loadProxy);
		}
	};
	anonymousSpace.MyApp = MyApp;
}());