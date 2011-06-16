
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


/**
 * The specialized event manager for the scene.
 *  
 * @param canvas
 * @param speedRotor
 * @param acceleration
 * @returns {MySpecializedEventNode}
 */
function MySpecializedEventManager(canvas, camera, speedRotor, acceleration)
{
	// TODO: Other events to be implemented...
	var thisObj = this;
	this.keyEventMngr = new KeyEventManager( 
			function(c){thisObj.handleKeyCode(c, true);}, 
			function(c){thisObj.handleKeyCode(c, false);} );
	
	this.mouseEventMngr = new CanvasMouseEventManager(canvas, 
			function(x,y){ /* empty function */ },
			function(x,y){thisObj.handleMouseDragInDirection(x,y);});

	this.speedRotor = speedRotor;
	this.acceleration = acceleration;
	this.camera = camera;
	
	this.shiftPressed = false;
	
	this.handleKeyCode = function(code, up)
	{
		if(code == 16) { // check shift
			if(up) {
				this.shiftPressed = true;
			} else {
				this.shiftPressed = false;
			}
			return;
		}

		if(! this.shiftPressed) {  // speed of rotor and rotation of camera
			switch (code) {

			case 107: // +
				if(up)
				this.speedRotor.speed += this.acceleration;
				break;

			case 109: // -
				this.speedRotor.speed -= this.acceleration;
				break;
			
			case 38: // up arrow
				if(up)
					this.camera.speedF = 1.0;
				else
					this.camera.speedF = 0.0;
				break;

			case 40: // down arrow
				if(up)
					this.camera.speedF = -1.0;
				else
					this.camera.speedF = 0.0;
				break;
				
			case 37: // left arrow
				if(up)
					this.camera.speedS = -1.0;
				else
					this.camera.speedS = 0.0;
				break;
				
			case 39: // right arrow
				if(up)
					this.camera.speedS = 1.0;
				else
					this.camera.speedS = 0.0;
				break;

			default:
				break;
			}
			
		} else {   // with shift...
			switch (code) {
				// nothing at the moment.
			}
		}
	};
	
	this.handleMouseDragInDirection = function(dx, dy) {
		
		this.camera.xrotation -= 0.0025 * dy;
		this.camera.yrotation -= 0.0025 * dx;
		
	};
	
}
