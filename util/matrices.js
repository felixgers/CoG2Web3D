/**
 * Container class for the matrices.
 */

function Matrices() {
	// Public variables.
	//
	// Projection matrix.
	this.pMatrix = mat4.create();
	// Model-View matrix.
	this.mvMatrix = mat4.create();
	// Matrix stack for mvMatrix.
	this.mvMatrixStack = [];
	// We do not yet need a matrix stack for pMatrix.

	this.mvPushMatrix = function() {
		var copy = mat4.create();
		mat4.set(this.mvMatrix, copy);
		this.mvMatrixStack.push(copy);
	};

	this.mvPopMatrix =  function() {
		if (this.mvMatrixStack.length == 0) {
			throw "Invalid popMatrix!";
		}
		this.mvMatrix = this.mvMatrixStack.pop();
	};
}

