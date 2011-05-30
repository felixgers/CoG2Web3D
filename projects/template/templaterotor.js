/**
 * An x rotor with variable speed.
 * @param startSpeed
 * @returns {RotorXMutableSpeed}
 */
function RotorXMutableSpeed(startSpeed) 
{ 
	this.speed = startSpeed;
	this.currentRotation = 0.0;
	this.lastTime = 0.0;
	
	// May be someone can help to optimize this method or get is faster.
	this.draw = function(gl, pMatrix, mvMatrix, time) {
		this.currentRotation += (time - this.lastTime) * Math.PI * this.speed;
		mat4.rotateX(mvMatrix, this.currentRotation);
		this.lastTime = time;
	};
}
RotorXMutableSpeed.prototype = new Node;
