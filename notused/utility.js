/**
 * JavaScript utility functions.
 */


////////Calculations ////////////////////////////////////////////////

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

////////Load local file via user file input //////////////////////////


//// Load source code for both, vertex an fragment shader.
//loadFiles(['vertex.shader', 'fragment.shader'], function (shaderSourceCode) {
//// Init vertex shader.
//var vertexShader = initShader(gl.VERTEX_SHADER, shaderSourceCode[0]);
//// Init fragment shader.
//var fragmentShader = initShader(gl.FRAGMENT_SHADER, shaderSourceCode[1]);
//}, function (url) { // Error callback.
//alert('Failed to download "' + url + '"');
//}, false); // Laod local files. 

function loadFileViaFileReader(url, fileIndex, callback, errorCallback) {
	// For this to work the following elements have to be in the HTML document:
	//	<input type="file" id="file" />
	// <div id="editor" contentEditable="true"></div>

	//Check for the various File API support.
	if (! (window.File && window.FileReader && window.FileList && window.Blob) ) {
		// Failed.
		errorCallback('No File API'+url);
	} 
	var finput = document.getElementById("file");
	var editor = document.getElementById("editor");
	var f = finput.files[0];
	if (f) {
		var r = new FileReader();
		r.onload = function(e) { editor.innerHTML = e.target.result; callback( e.target.result, fileIndex ); };
		r.onerror = function(e) { errorCallback('Error '+e.target.error.code+' on file '+url); };
		r.readAsText(f);
	} else { errorCallback('Error opening file '+url); }
}


////////Load external file via web server ///////////////////

function loadFileViaXMLHttpRequest(url, urlIndex, callback, errorCallback) {
	// Set up an asynchronous request
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	// Hook the event that gets called as the request progresses
	request.onreadystatechange = function () {
		// If the request is "DONE" (completed or failed)
		if (request.readyState == 4) {
			// If we got HTTP status 200 (OK)
			if (request.status == 200) {
				callback(request.responseText, urlIndex);
			} else { // Failed
				errorCallback(url);
			}
		}
	};

	request.send(null);    
}

///////// Load a list of files ///////////////////////////

//Load all files given in parameter urls und 
//wait for all of them to finish loading.
//Then execute the callback.
//Load local files or set ViaXMLHttpRequest true.
function loadFilesViaXMLHttpRequest(urls, callback, errorCallback, ViaXMLHttpRequest) {
	var numUrls = urls.length;
	var numComplete = 0;
	var result = [];

	// Callback for a single file
	function partialCallback(text, index) {
		result[index] = text;
		numComplete++;

		// When all files have downloaded
		if (numComplete == numUrls) {
			callback(result);
		}
	}

	for (var i = 0; i < numUrls; i++) {
		if(ViaXMLHttpRequest) {
			loadFileViaXMLHttpRequest(urls[i], i, partialCallback, errorCallback);
		} else {
			loadFileViaFileReader(urls[i], i, partialCallback, errorCallback);			
		}
	}
}


///////////////// Organize code ////////////////////////////

//Include JavaScript and css files.
var include = (function() {
	var included = [],
	head,
	defaultTimeout = 10;
	function log(type,message) {
		window.console && window.console[type || 'log'](Array.prototype.join.apply(Array.prototype.slice.apply(arguments,[1]),[' ']));
	}
	return function (url, watch, callback, timeout) {
		var element,
		check,
		startTime = new Date().getTime();

		callback = callback || function(){};		

		if (included.indexOf(url)>-1) {
			log('warn', "Duplicate include, skipping:", url);
			callback(true);
			return true;
		}
		included.push(url);

		switch (url.split(".").pop()) {
		case "css":
			element = document.createElement("link");
			element.setAttribute("rel", "stylesheet");
			element.setAttribute("type", "text/css");
			element.setAttribute("href", url);
			break;
		case "js":
			element = document.createElement("script");
			element.setAttribute("type", "text/javascript");
			element.setAttribute("src", url);
			break;
		default:
			log('error', "could not identify", url, "skip include");
		return;
		}
		if (!head) {
			head = document.getElementsByTagName("head");
			head = head && head[0];
		}
		if (head) {
			head.appendChild(element);
		}

		if (watch) {
			check = function() {
				if (window.hasOwnProperty(watch)) {
					callback(true);
					check = element = null;
				}
				else if (new Date().getTime()-startTime>(timeout || defaultTimeout)*1000) {
					log('error', "include('",url,"') timed out");
					callback(false);
					element.parentNode.removeChild(element);
					check = element = null;
				}
				else {
					setTimeout(check, 50);
				}
			};
			setTimeout(check, 50);
		}
	};
}());

