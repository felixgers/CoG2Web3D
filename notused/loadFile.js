///////// Load a list of files via HTTP request ///////////////////////////

// Usage:
////Load source code for both, vertex an fragment shader.
//loadFiles(['vertex.shader', 'fragment.shader'], function (shaderSourceCode) {
//var vertexShader = initShader(gl.VERTEX_SHADER, shaderSourceCode[0]);
//var fragmentShader = initShader(gl.FRAGMENT_SHADER, shaderSourceCode[1]);
//}, function (url) { // Error callback.
//alert('Failed to download "' + url + '"');
//}, false); // Laod local files. 


//This is a private function.
//Load one file/URL and call back.
function loadFileViaXMLHttpRequest(url, urlIndex, callback, errorCallback) {
//	Set up an asynchronous request
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

//	Hook the event that gets called as the request progresses
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


//Load all files given in parameter urls und 
//wait for all of them to finish loading.
//Then execute the callback.
//Load local files or set ViaXMLHttpRequest true.
function loadFilesViaXMLHttpRequest(urls, callback, errorCallback) {
	var numUrls = urls.length;
	var numComplete = 0; // Count URLs that completed loading.
	var result = []; // Content array of URLs loaded.

	//	Callback for a single file.
	function partialCallback(text, index) {
		result[index] = text;
		numComplete++;

		// When all files are downloaded.
		if (numComplete == numUrls) {
			callback(result);
		}
	}
	//	Loop URLS and load them
	for (var i = 0; i < numUrls; i++) {
		loadFileViaXMLHttpRequest(urls[i], i, partialCallback, errorCallback);
	}
}
