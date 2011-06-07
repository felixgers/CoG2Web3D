
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