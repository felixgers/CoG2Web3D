function MyApp(){};
MyApp.prototype = new App;

MyApp.prototype.getScene = function() {
	return new MyScene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};

MyApp.prototype.getEventManager = function() {
	return new MyEventManager().init(this);
};