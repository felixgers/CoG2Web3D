dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.Textarea");
dojo.addOnLoad(function() {
        var aContainer = new dijit.layout.AccordionContainer({
            style: "height: 300px"
        },
        "markup"),
        textareaCollada=new dijit.form.Textarea({
            name: "collada",
            id: "collada_area",
            value: "",
            style: "width:200px;",
            cols:"50",
            rows:"13"
        }),
        textareaJSON=new dijit.form.Textarea({
            name: "collada",
            id: "json_area",
            value: "",
            style: "width:200px;",
            cols:"50",
            rows:"13"
        });

        
        aContainer.addChild(new dijit.layout.ContentPane({
            title: "Collada",
            content: textareaCollada
        }));
        aContainer.addChild(new dijit.layout.ContentPane({
            title: "JSON",
            content: textareaJSON
        }));
        aContainer.startup();
});


dojo.ready(function(){


   //call this app module and
   //init with canvas object from HTML page
   dojo.registerModulePath("BGE.ViewerApp","../../tools/ui/viewerApp");
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
   dojo.connect(dojo.byId("collada_area"), "onclick", function(evt) {
       var content=dojo.byId('collada_area').value;
       
       if(content!=""){
           var json=BGE.myViewer.parseXML(content);
           if(json!=null){
                dojo.byId("json_area").value=json;
                BGE.myViewer.addNewModel(json);
           }
       }
   });
   /*
   dojo.connect(dojo.byId("delete_button"), "onclick", function(evt) {
	    alert("loeschen");
       BGE.myViewer.setCanvasClear();
   });
   */
 });
