dojo.ready(function(){
   //call this app module and
   //init with canvas object from HTML page
   BGE.namespace("myViewer");
   BGE.myViewer=BGE.ViewerApp;
   BGE.myViewer.init(dojo.byId("canvas"));

    /*
   $.ajaxSetup({'beforeSend': function(xhr){
		if (xhr.overrideMimeType)
			xhr.overrideMimeType("text/json");
		}
   });
   */
   dojo.connect(dojo.byId("parse_button"), "onclick", function(evt) {
       var json=BGE.myViewer.parseXML(dojo.byId('collada_area').value);
	   if(json!=null){
            dojo.byId("json_area").value=json;
			BGE.myViewer.addNewModel(json);
	   }else{
			alert("ein Fehler ist aufgetreten.");
	   }
   });

   dojo.connect(dojo.byId("delete_button"), "onclick", function(evt) {
		BGE.myViewer.setCanvasClear();
   });
 });
