$(document).ready(function(){
   $("#parse_button").click(function(event){
       var json=myController.parse(document.getElementById('collada_area').value);
	   
	   if(json!=null){
			myController.scene.addNewModel(json);
			$("#json_area").val(json);
	   }else{
			alert("ein Fehler ist aufgetreten.");
	   }
   });
 });


var Controller=function(){

  var scene;

} 
var myController = new Controller;

Controller.prototype.load=function(){
	var myApp=new MyApp();
	myApp.start('canvas');
	this.scene=myApp.scene;
}

Controller.prototype.parse=function (data){

	if (data!=null && data.length != 0 ){
		var parser=new ColladaParser();
		json=parser.parseCollada(data);
		return json;
	}
	return;
}
