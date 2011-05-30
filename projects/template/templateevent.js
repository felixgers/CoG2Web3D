/**
 * The specialized event manager for the scene.
 *  
 * @param canvas
 * @param speedRotor
 * @param acceleration
 * @returns {MySpecializedEventNode}
 */
function MySpecializedEventManager(canvas, speedRotor, acceleration)
{
	// TODO: Other events to be implemented...
	var thisObj = this;
	this.keyEventMngr = new KeyEventManager( function(c){thisObj.handleKeyCode(c);} );
	this.mouseEventMngr = new CanvasMouseEventManager(canvas, function(x,y){thisObj.handleMouseClickAtPosition(x,y);});

	this.speedRotor = speedRotor;
	this.acceleration = acceleration;
	
	// DEBUG
	// --------------------------------------------
	this.debug = document.createElement("div");
	canvas.parentNode.appendChild(this.debug);
	this.debug.innerHTML = "debug events";
	// --------------------------------------------
	
	
	this.handleKeyCode = function(code)
	{
		switch (code) {
		case 38: // up arrow
			this.speedRotor.speed += this.acceleration;
			break;

		case 40: // down arrow
			this.speedRotor.speed -= this.acceleration;
			break;

		default:
			break;
		}

		// DEBUG
		// --------------------------------------------
		this.debug.innerHTML = "keydown: "+ code + " speed:"+ parseInt(this.speedRotor.speed*100)/100.0;
		// --------------------------------------------
	};
	
	
	this.handleMouseClickAtPosition = function(x, y) {
		
		// DEBUG
		// --------------------------------------------
		this.debug.innerHTML = "mousedown: "+ x + ":" + y;
		// --------------------------------------------
	};
	
}
