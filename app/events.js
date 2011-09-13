/*
 * Event are handled in a top-down fashion first. 
 * Then an event is passed on to the scenegraph via the scene,
 * where it is propagated through the hierarchy.
 */

function EventManager(app){
	this.app;
	this.scene;
	this.canvas;

	this.init = function( app ) {
		this.app = app;
		this.scene = this.app.scene;
		this.canvas = this.app.canvas;

		this.initEventHandlers();
		this.initCustomEventHandlers();

		return this;
	};
};

/**
 * Override this method to handle events differently.
 */
EventManager.prototype.initEventHandlers = function() {
	var thisEM = this;
	var app = this.app;
	var scene = this.scene;
	var canvas = this.canvas;

	// Propagate canvas events to the scene.
	canvas.addEventListener("click", function(e){scene.handleMouseEvent(e);}, false);
	canvas.addEventListener("mousedown", function(e){scene.handleMouseEvent(e);}, false);
	canvas.addEventListener("mouseup", function(e){scene.handleMouseEvent(e);}, false);
	canvas.addEventListener("mousover", function(e){scene.handleMouseEvent(e);}, false);
	canvas.addEventListener("mousemove", function(e){scene.handleMouseEvent(e);}, false);
	canvas.addEventListener("mousout", function(e){scene.handleMouseEvent(e);}, false);

	// Propagate key events to the scene.
	document.onkeydown = function(e){scene.handleKeyDown(e);};
	document.onkeyup = function(e){scene.handleKeyUp(e);};

	// Handle application mouse events.
	document.addEventListener("click", function(e){thisEM.handleMouseEvent(e);}, false);
	document.addEventListener("mousedown", function(e){thisEM.handleMouseEvent(e);}, false);
	document.addEventListener("mouseup", function(e){thisEM.handleMouseEvent(e);}, false);
	document.addEventListener("mousover", function(e){thisEM.handleMouseEvent(e);}, false);
	document.addEventListener("mousemove", function(e){thisEM.handleMouseEvent(e);}, false);
	document.addEventListener("mousout", function(e){thisEM.handleMouseEvent(e);}, false);
	
	// Handle application key events.
	document.onkeydown = function(e){thisEM.handleKeyDown(e);};
	document.onkeyup = function(e){thisEM.handleKeyUp(e);};
};

/**
 * Override this method to use custom event handlers.
 */
EventManager.prototype.initCustomEventHandlers = function() {
};


/**
 * Override to handle events.
 * @param event
 */
EventManager.prototype.handleMouseEvent = function(e) {
};

/**
 * Override to handle events.
 * @param event
 */
EventManager.prototype.handleKeyDown = function(e) {
};

/**
 * Override to handle events.
 * @param event
 */
EventManager.prototype.handleKeyUp = function(e) {
};



//todo integrate the following

/**
 * Key event manager sends key event codes
 * @param listener
 * @returns {KeyEventManager}
 */
function KeyEventManager(keyCallback, keyUpCallback) {

	this.keyCallback = keyCallback;
	this.keyUpCallback = keyUpCallback;
	var thisEM = this;

	// TODO: Other events to be implemented...
	document.onkeydown = function(event){thisEM.handleKeyDown(event);};
	document.onkeyup = function(event){thisEM.handleKeyUp(event);};


	this.handleKeyDown = function(event) {
		var code = -1;
		if (!event)
			event = window.event;
		if (event.which) {
			code = event.which;
		} else if (event.keyCode) {
			code = event.keyCode;
		}
		this.keyCallback(code);
	};

	this.handleKeyUp = function(event) {
		var code = -1;
		if (!event)
			event = window.event;
		if (event.which) {
			code = event.which;
		} else if (event.keyCode) {
			code = event.keyCode;
		}
		this.keyUpCallback(code);
	};

}

function CanvasMouseEventManager(canvas, eventCallback, downMoveCallBack) {

	this.canvas = canvas;
	this.eventCallback = eventCallback;
	this.downMoveCallBack = downMoveCallBack;
	this.lastX = 0;
	this.lastY = 0;
	var thisEM = this;
	this.downMove = false;

	// Event listeners for mouse click.
	canvas.addEventListener("click", function(e){thisEM.handleMouseClick(e);}, false);

	// Event listeners for drag like mouse move on canvas.
	canvas.addEventListener("mousedown", function(e){thisEM.handleDownMove(e, 1);}, false);
	window.addEventListener("mouseup", function(e){thisEM.handleDownMove(e, -1);}, false);
	window.addEventListener("mousout", function(e){thisEM.handleDownMove(e, -1);}, false);
	window.addEventListener("mousemove", function(e){thisEM.handleDownMove(e, 0);}, false);


	/**
	 * downMove means the drag like mouse move with pressed left mouse button
	 */
	this.handleDownMove = function(e, m) {
		var x;
		var y;
		if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
			y = e.pageY;
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		var canvas = this.canvas;
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;

		var dm = this.downMove;

		if(m > 0) {
			this.lastX = x; // Set lastXY for init
			this.lastY = y;
			dm = true;
			this.downMove = dm;
			return;
		} else if (m < 0) {
			dm = false;
			this.downMove = dm;
			return;
		}
		if(dm) {
			this.downMoveCallBack(this.lastX-x, this.lastY-y);
			this.lastX = x;
			this.lastY = y;
		}
	};

	this.handleMouseClick = function(e) 
	{
		var x;
		var y;
		if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
			y = e.pageY;
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		var canvas = this.canvas;
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;

		this.eventCallback(x, y);
	};
}

////////////////////dependent imports ////////////////////

BGE.importScript("myEvents.js");

