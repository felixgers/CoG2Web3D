dojo.provide("BGE.UploadHandler");
BGE.UploadHandler=(function(){
    var files,
        reader = new FileReader(),
        requiredFiles="",
        fileExtensions="",
        isSupportedFileExtension=function(f){
            //regular expression with file extension, because f.type is empty
            requiredFiles = "(.*?)\.(" + fileExtensions +")$";
            if (!f.name.match(requiredFiles)) {
               alert('Es werden nur Dateien vom Typ ' + fileExtensions + ' unterstützt.');
               return false;
            }else
               return true;
        },
        checkFileUploadAvailable=function(){
           if (window.File && window.FileReader && window.FileList && window.Blob) {
             return true;
           } else {
             return false;
           }
           },
           handleDragOver=function(e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            },
           handleDrop=function(e,targetComponent,_fileExtension){
               e.stopPropagation();
               e.preventDefault();
               fileExtensions=_fileExtension;
               files = e.dataTransfer.files; // FileList object.
               processFileUpload(e,targetComponent);
           },
           handleUpload=function(e,targetComponent,_fileExtension) {
               files = e.target.files; // FileList object
               fileExtensions=_fileExtension;
               processFileUpload(e,targetComponent);
           },
           processFileUpload = function(e,targetComponent){
               // Loop through the FileList and render image files as thumbnails.
               for (var i = 0, f; f = files[i]; i++) {
                   if (isSupportedFileExtension(f)){
                       // Closure to capture the file information.
                       reader.onload = (function(theFile) {
                             return function(e) {
                                 targetComponent.value=e.target.result;
                              };
                       })(f);
                       // Read in the image file as a data URL.
                       reader.readAsText(f);
                    }
               }
               files=null;
           };

           return{
                   checkFileUploadAvailable:checkFileUploadAvailable,
                   handleUpload:handleUpload,
                   handleDragOver:handleDragOver,
                   handleDrop:handleDrop
           };

}());