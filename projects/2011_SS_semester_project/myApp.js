function MyApp(){};
MyApp.prototype = new App;

MyApp.prototype.getScene = function() {
	return new MyScene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};

MyApp.prototype.getShader = function() {
	return new Shader().init(this.gl, "../../shader/color.vertex", "../../shader/color.fragment");
};
