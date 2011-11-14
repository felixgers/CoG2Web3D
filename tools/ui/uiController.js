dojo.ready(function(){
   //call this app module and
   //init with canvas object from HTML page

   
   dojo.registerModulePath("BGE.ViewerApp","../tools/ui/viewerApp");
   dojo.require("BGE.ViewerApp");
   dojo.provide("BGE.myViewer");

   dojo.registerModulePath("BGE.App","../app/app");
   dojo.require("BGE.App");
   BGE.importScript("../../ext/tinyxmlw3cdom.js");
   BGE.importScript("../../ext/tinyxmlsax.js");
   BGE.importScript("../../ext/tinyxmlxpath.js");
   BGE.importScript("../../ext/json2.js");
   BGE.importScript("../../ext/xmldom.js");

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
