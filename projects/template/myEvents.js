function MyEventManager(){
};
MyEventManager.prototype = new EventManager;


MyEventManager.prototype.initCustomEventHandlers = function() {
	var app = this.app;
	// Set Application events handlers.
	//
	// Start rendering loop.
	var stopButton = document.getElementById('stopButton');
	stopButton.addEventListener("click", function(e){app.stopLoop();}, false);
	// Stop rendering loop.
	var startButton = document.getElementById('startButton');
	startButton.addEventListener("click", function(e){app.startLoop();}, false);
};

MyEventManager.prototype.handleMouseEvent = function(e) {
};

MyEventManager.prototype.handleKeyDown = function(e) {
};

MyEventManager.prototype.handleKeyUp = function(e) {
};

