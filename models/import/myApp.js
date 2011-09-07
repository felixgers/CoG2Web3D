function MyApp(){
	this.vetexShaderName = "../../shader/color.vertex";
	this.fragmentShaderName = "../../shader/color.fragment";

	
}
MyApp.prototype = new App;

MyApp.prototype.clear=function(){
	  //this.gl.clearRect(0, 0, this.width, this.height);
	  var w = this.width;
	  this.canvas.width = 1;
	  this.canvas.width = w;
	  
};

$(document).ready(function(){
   
   var myApp=new MyApp();
   myApp.start('canvas');
   $("#parse_button").click(function() {
        var json=myApp.parse(document.getElementById('collada_area').value);

	   if(json!=null){
			myApp.scene.addNewModel(json);
			$("#json_area").val(json);
	   }else{
			alert("ein Fehler ist aufgetreten.");
	   }
   });
   
   $("#delete_button").click(function() {
		myApp.scene.clear();
       	myApp.clear();
		
   });
   
 });




MyApp.prototype.parse = function (data) {

    var json;
    if (data != null && data.length != 0) {
        var parser = new ColladaParser();
        json = parser.parseCollada(data);
        return json;
    }

};
