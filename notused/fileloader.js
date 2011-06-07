/**
 * Actually the jquery has http request too.
 * But in this case it seemed easier to make this
 * simple interface, because jquery is dedicated to make it easy to 
 * load xml or json, etc. But loading simple plain text seems hard.
 * 
 * To load simple text one must also apply overrideMimeType("text/plain")
 * on the XMLHttpRequest object.
 * 
 * @param url
 * @param mimeType
 * @returns {FileLoader}
 */
function FileLoader(url, mimeType) {
	this.url = url;
	this.mimeType = mimeType;
	this.req = false;
	this.reqData = "";
	this.reqFunc = null;
	
	FileLoader.prototype.processReqChange = function() {
		var req = this.req;
		var reqFunc = this.reqFunc;
		
		if (req.readyState == 4) {
			var reqData = req.responseText;
			if (reqFunc) {
				reqFunc(reqData);
			}
		}
	};

	
	FileLoader.prototype.load = function(callBack) {
		var req = false;
		// branch for native XMLHttpRequest object
		if(window.XMLHttpRequest && !(window.ActiveXObject))
		{
			try { req = new XMLHttpRequest(); }
			catch(e) { alert("Could not create XMLHttpRequest"); req = false; }
		}
		// branch for IE/Windows ActiveX version
		else if(window.ActiveXObject)
		{
			try { req = new ActiveXObject("Msxml2.XMLHTTP"); }
			catch(e)
			{
				try { req = new ActiveXObject("Microsoft.XMLHTTP"); }
				catch(e) { req = false; }
			}
		}
		
		this.req = req;
		
		if(req) {
			this.reqFunc = callBack;
			var that = this;
			req.onreadystatechange = function(){that.processReqChange();};
			req.open("GET", url, true);
			req.send(null);
			if(this.mimeType!= null) {
				req.overrideMimeType(this.mimeType);
			}
		}
	};
}

/**
 * This function might be sometimes better for handling other javascript code
 * following the file load.
 * 
 * @param url
 * @returns
 */
function syncLoadFile(url, mimeType) {

	var req = false;
	// branch for native XMLHttpRequest object
	if(window.XMLHttpRequest && !(window.ActiveXObject))
	{
		try { req = new XMLHttpRequest(); }
		catch(e) { 
			alert("Could not create XMLHttpRequest"); 
			return null;
		}
	}
	// branch for IE/Windows ActiveX version
	else if(window.ActiveXObject)
	{
		try { req = new ActiveXObject("Msxml2.XMLHTTP"); }
		catch(e)
		{
			try { req = new ActiveXObject("Microsoft.XMLHTTP"); }
			catch(e) { 
				alert("Could not create ActiveXObject XMLHTTP"); 
				return null;
			}
		}
	}
	
	if(!req)
		return null;

	if(mimeType!= null) {
		req.overrideMimeType(mimeType);
	}
	req.open("GET", url, false); // Do not open asynchronously, thus wait for the response.
	req.send(null);
	var s = 200;
	if(mimeType="text/plain") {
		var s = 0;
	}
	if(req.status == s) { // == 0 for text file
		return req.responseText;
	}
	return null;
	 	
}
