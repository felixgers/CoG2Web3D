BGE.namespace("MyApp");
BGE.MyApp = function(){
//	this.vetexShaderName = "../../shader/simple.vertex";
//	this.fragmentShaderName = "../../shader/white.fragment";	
	this.vetexShaderName = "../../shader/color.vertex";
	this.fragmentShaderName = "../../shader/color.fragment";	
};
BGE.MyApp.prototype = new BGE.App;
