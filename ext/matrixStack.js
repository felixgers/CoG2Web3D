/**
 * Matrix stack.
 * Based on glMatrix.
 */

function MatrixStack() {
	// Public variables.
	//
	// Matrix first on top of the stack.
	// The top matrix is the on to work with.
	// Top must always exist, also on the stack.
	this.top = mat4.create();
	this.stack = [];
	// The top matrix must always remain  on the stack;
	this.stack.push(this.top);
}

MatrixStack.prototype.push = function() {
	var copy = mat4.create();
	mat4.set(this.top, copy);
	this.stack.push(copy);
};

MatrixStack.prototype.pop =  function() {
	try{
		if(this.stack.length <= 1) {
			throw "popLastMatrix";
		}
	} catch(exception){
		if(exception == "popLastMatrix"){
			alert("Invalid pop matrix, only top matrix on stack!");
		}
		return;
	}
	this.top = this.stack.pop();
};

MatrixStack.prototype.identity = function() {
	mat4.identity(this.top);
};

MatrixStack.prototype.translate = function(vec) {
	mat4.translate(this.top, vec);
};

MatrixStack.prototype.scale = function(vec) {
	mat4.scale(this.top, vec);
};

MatrixStack.prototype.rotate = function(angle, axis) {
	mat4.rotate(this.top, angle, axis);
};

MatrixStack.prototype.rotateX = function(angle) {
	mat4.rotateX(this.top, angle);
};

MatrixStack.prototype.rotateY = function(angle) {
	mat4.rotateY(this.top, angle);
};

MatrixStack.prototype.inverse = function(mat) {
	return mat4.inverse(mat);
};

MatrixStack.prototype.transpose = function(mat) {
	return mat4.transpose(mat);
};

MatrixStack.prototype.flatten = function(array) {
        var flat = [];
        for (var i = 0, l = array.length; i < l; i++){
            var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
            if (type) { flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten(array[i]) : array[i]); }
        }
        return flat;
};

MatrixStack.prototype.rotateZ = function(angle) {
	mat4.rotateZ(this.top, angle);
};

MatrixStack.prototype.frustum = function(left, right, bottom, top, near, far) {
	mat4.frustum(left, right, bottom, top, near, far, this.top);
};

MatrixStack.prototype.perspective = function(fovy, aspect, near, far) {
	mat4.perspective(fovy, aspect, near, far, this.top);
};

MatrixStack.prototype.ortho = function(left, right, bottom, top, near, far) {
	mat4.ortho(left, right, bottom, top, near, far, this.top);
};

MatrixStack.prototype.lookAt = function(eye, center, up) {
	mat4.lookAt(eye, center, up, this.top);
};
