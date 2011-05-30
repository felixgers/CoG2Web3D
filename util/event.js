
/**
 * Key event manager sends key event codes
 * @param listener
 * @returns {KeyEventManager}
 */
function KeyEventManager(eventCallback) {
	
	this.eventCallback = eventCallback;
	var thisEM = this;
	
	// TODO: Other events to be implemented...
	document.onkeydown = function(event){thisEM.handleKeyDown(event);};
	
	this.handleKeyDown = function(event) {
		
		var code = -1;
		if (!event)
			event = window.event;
		if (event.which) {
			code = event.which;
		} else if (event.keyCode) {
			code = event.keyCode;
		}
		this.eventCallback(code);
	};
	
}

function CanvasMouseEventManager(canvas, eventCallback) {

	this.canvas = canvas;
	this.eventCallback = eventCallback;
	var thisEM = this;
	
	// TODO: Other events to be implemented...
	canvas.addEventListener("click", function(e){thisEM.handleMouseClick(e);}, false);
	
	
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