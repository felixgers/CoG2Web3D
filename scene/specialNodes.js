
/**
 * Specialized scene graph nodes for template scene.
 */

/**
 * An x rotor with variable speed.
 * @param startSpeed
 * @returns {RotorXMutableSpeed}
 */
function RotorXMutableSpeed(startSpeed) 
{ 
	this.speed = startSpeed;    // <-- mutable speed. Change this.
	this.currentRotation = 0.0;
	this.lastTime = 0.0;

	// May be someone can help to optimize this method or get is faster.
	this.draw = function(time) {
		this.currentRotation += (time - this.lastTime) * Math.PI * this.speed;
		mat4.rotateX(this.mvMatrix, this.currentRotation);
		this.lastTime = time;
	};
}
RotorXMutableSpeed.prototype = new Node;