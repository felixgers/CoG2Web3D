
BGE.namespace("MyApp");
BGE.MyApp = function(){
	this.vetexShaderName = "../../shader/color.vertex";
	this.fragmentShaderName = "../../shader/color.fragment";
}
BGE.MyApp.prototype = new BGE.App;



$(document).ready(function(){
   
   var myApp=new BGE.MyApp();
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

   console.log("check globals:");
   console.log("Type App: " + typeof(window.App));
   console.log("Type Scene: " + typeof(window.Scene));
   console.log("Type Shape: " + typeof(window.Shape));
   console.log("Type EventManager: " + typeof window.EventManager);
   console.log("Type MyApp: " + typeof(window.MyApp));
   console.log("Type MyScene: " + typeof window.MyScene);
   console.log("Type Group: " + typeof window.Group);
 });




BGE.MyApp.prototype.parse = function (data) {

    var json;
    if (data != null && data.length != 0) {
        var parser = new ColladaParser();
        json = parser.parseCollada(data);
        return json;
    }

};
