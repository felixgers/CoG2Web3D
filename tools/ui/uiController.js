dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.Button");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dojox.form.Uploader");
dojo.require("dojox.form.uploader.plugins.IFrame");
dojo.ready(function(){


        //init with canvas object from HTML page
        dojo.registerModulePath("BGE.ViewerApp","../../tools/ui/viewerApp");
        dojo.require("BGE.ViewerApp");
        dojo.provide("BGE.myViewer");

        BGE.myViewer=BGE.ViewerApp;
        BGE.myViewer.init(dojo.byId("canvas"));
    
        var selectedContentPane,
            uploadAvailable=BGE.myViewer.checkFileUploadAvailable(),
            bc = new dijit.layout.BorderContainer({
                style: "height: 550px; width: 1024px;"
            },"markup"),
            accordionContainer = new dijit.layout.AccordionContainer({
                id:"accordionContainer",
                style: "height: 100px",
                onClick:function(){
                    setSelectedContentPane();
                }
            }),
            txtCollada=new dijit.form.Textarea({
                name: "collada",
                id: "collada_area",
                value: "",
                baseClass: "textarea"
            }),
            txtJSON=new dijit.form.Textarea({
                name: "collada",
                id: "json_area",
                value: "",
                baseClass: "textarea",
                cols:"50",
                rows:"13"
            }),
            toolbarCollada = new dijit.Toolbar({}),
            toolbarJSON = new dijit.Toolbar({}),
            toolbarScene = new dijit.Toolbar({}),

            btnDelete=new dijit.form.Button({
               name:"deleteButton",
               id:"delete_button",
               label:"löschen",
               showLabel:false,
               iconClass:'iconDelete',
               onClick:function(){
                   BGE.myViewer.setCanvasClear();
               }
            }),
            btnParse=new dijit.form.Button({
               name:"parseButton",
               id:"btnParse",
               label:"Collada parsen",
               showLabel:false,
               iconClass:'iconParse',
               onClick:function(){
                   parseCollada();
               }
            }),
            btnAddNewJSONModel=new dijit.form.Button({
               name:"addModelButton",
               id:"btnAddNewJSONModel",
               label:"Zur Scene hinzufügen",
               showLabel:false,
               iconClass:'iconParse',
               onClick:function(){
                   addNewModel(dojo.byId("json_area").value);
               }
            }),
            btnUploadCollada=new dijit.form.Button({
               id:"btnUploadCollada",
               label:"Datei hochladen",
               showLabel:false,
               style: (uploadAvailable ? 'visibility:visible' : 'visibility:hidden'),
               iconClass:'iconUpload',
               onClick:function(){
                   dialogUploadFile.show();
               }
            }),
            btnUploadJSON=new dijit.form.Button({
               id:"btnUploadJSON",
               label:"Datei hochladen",
               showLabel:false,
               style: (uploadAvailable ? 'visibility:visible' : 'visibility:hidden'),
               iconClass:'iconUpload',
               onClick:function(){
                   dialogUploadFile.show();
               }
            }),
            btnHelpCollada=new dijit.form.Button({
               id:"btnHelp",
               label:"Dokumentation",
               showLabel:false,
               iconClass:'iconHelp',
               onClick:function(){
                   dialogHelpCollada.show();
               }
            }),
            contentPaneCollada=new dijit.layout.ContentPane({
                title: "Collada",
                name:"contentPaneCollada",
                content: txtCollada,
                style: 'padding:0px'
            }),
            contentPaneJSON= dijit.layout.ContentPane({
                title: "JSON",
                name:"contentPaneJSON",
                content: txtJSON
            }),
            contentPaneScene = new dijit.layout.ContentPane({
                 region: "right",
                 style: "height:450px;width:500px;padding-top:10px",
                 content: dojo.byId('canvas')
            }),
            contentPaneLeft = new dijit.layout.ContentPane({
                 region: "left",
                 style: "height: 470px;width:500px",
                 content: accordionContainer
            }),
            uploader = new dojox.form.Uploader({
                label:"Programmatic Uploader",
                multiple:true,
                uploadOnSelect:true,
                id:'uploader',
                url:'none'
            }),
            dialogUploadFile=new dijit.Dialog({
                title: "Collada Datei hochladen",
                style: "width: 300px",
                id:'dialogUploadFile',
                content:dojo.byId('files')
            }),
            dialogHelpCollada=new dijit.Dialog({
                title: "Dokumentation",
                style: "width: 300px",
                id:'dialogHelpCollada',
                content:'<ul><li>Kopieren Sie die gew&uuml;nschten Collada Dateien per Copy and Paste, per Dateiupload oder per Drag and Drop in das Textfeld.</li>' +
                        ' <li>Starten Sie dann das Umwandeln der Collada Datei &uuml;ber den Zahnradbutton.</li>' +
                        ' <li> Danach k&ouml;nnen Sie den JSON-String aus dem Bereich JSON kopieren. Klicken Sie hierzu auf den JSON-Reiter.</li>' +
                        '</ul>'
            }),
            parseCollada=function(){
               //the change in case of upload or drag n' drop seems not in txtCollada.value
               //so we need dojo.connect
               var content=dojo.byId("collada_area").value;
               if(content!==""){
                   var json=BGE.myViewer.parseXML(content);
                   if(json!==null){
                      dojo.byId("json_area").value=json;
                                  addNewModel(json);
                   }
               }
            },
            addNewModel=function(json){
               BGE.myViewer.addNewModel(json);
            },
            setSelectedContentPane=function(){
                selectedContentPane=accordionContainer.selectedChildWidget.name;
            };

            //initialize  selectedContentPane
            selectedContentPane=contentPaneCollada.name;


            toolbarScene.addChild(btnDelete);

            toolbarCollada.addChild(btnParse);
            toolbarCollada.addChild(btnUploadCollada);
            toolbarCollada.addChild(btnHelpCollada);
            toolbarJSON.addChild(btnAddNewJSONModel);
            toolbarJSON.addChild(btnUploadJSON);

            toolbarScene.placeAt(contentPaneScene.containerNode,'first');
            toolbarCollada.placeAt(contentPaneCollada.containerNode,'first');
            toolbarJSON.placeAt(contentPaneJSON.containerNode,'first');

            accordionContainer.addChild(contentPaneCollada);
            accordionContainer.addChild(contentPaneJSON);

            accordionContainer.startup();


            bc.addChild(contentPaneLeft);
            bc.addChild(contentPaneScene);
            bc.startup();



            if(uploadAvailable)dojo.byId('files').style.visibility='visible';

            //it seems dojo doesn't support drag 'n drop, so we add this eventListener in old school way
  
           //add dragover eventListener to colladaArea
           dojo.connect(dojo.byId("collada_area"), "dragover", function(evt) {
              BGE.myViewer.handleDragOver(evt);
           });
           //add drop eventlistener to colladaarea
           dojo.connect(dojo.byId("collada_area"), "drop", function(evt) {
              BGE.myViewer.handleDrop(evt,dojo.byId("collada_area"),"dae")
           });

           //add eventListener for upload Collada
           dojo.connect(dojo.byId("uploader"), "onchange", function(evt) {
                //check visible contentPane
              switch (selectedContentPane){
                   case contentPaneCollada.name:BGE.myViewer.handleUpload(evt,dojo.byId("collada_area"),"dae");break;
                   case contentPaneJSON.name:BGE.myViewer.handleUpload(evt,dojo.byId("json_area"),"json");break;
                   default:alert("Not supported");
               }

                dialogUploadFile.hide();

           });




   
 });




