//>>built
// wrapped by build app
define("dojox/robot/recorder", ["dijit","dojo","dojox"], function(dijit,dojo,dojox){
dojo.provide("dojox.robot.recorder");
dojo.experimental("dojox.robot.recorder");
// summary:
// 	Generates a doh example as you interact with a Web page.
// 	To record a example, click inside the document body and press CTRL-ALT-ENTER.
// 	To finish recording a example and to display the autogenerated code, press CTRL-ALT-ENTER again.
//


(function(){

// CONSTANTS

// consolidate keypresses into one typeKeys if they occur within 1 second of each other
var KEYPRESS_MAXIMUM_DELAY = 1000;

// consolidate mouse movements if they occur within .5 seconds of each other
var MOUSEMOVE_MAXIMUM_DELAY = 500;

// absolute longest wait between commands
// anything longer gets chopped to 10
var MAXIMUM_DELAY = 10000;

// stack of commands recorded from dojo.connects
var commands = [];

// number to write next to example name
// goes up after each recording
var testNumber = 0;

// time user started example
var startTime = null;

// time since last user input
// robot commands work on deltas
var prevTime = null;

var start = function(){
	// summary:
	//	Starts recording the user's input.
	//
	alert("Started recording.");
	commands = [];
	startTime = new Date();
	prevTime = new Date();
}

var addCommand = function(name, args){
	// summary:
	//	Add a command to the stack.
	//
	// name:
	//	doh.robot function to call.
	//
	// args:
	//	arguments array to pass to the doh.robot
	//

	// omit start/stop record
	if(startTime == null
		|| name=="doh.robot.keyPress"
		&& args[0]==dojo.keys.ENTER
		&& eval("("+args[2]+")").ctrl
		&& eval("("+args[2]+")").alt){ return; }
	var dt = Math.max(Math.min(Math.round((new Date()).getTime() - prevTime.getTime()),MAXIMUM_DELAY),1);
	// add in dt
	// is usually args[1] but there are exceptions
	if(name == "doh.robot.mouseMove"){
		args[2]=dt;
	}else{
		args[1]=dt;
	}
	commands.push({name:name,args:args});
	prevTime = new Date();
}

var _optimize = function(){
	// make the stack more human-readable and remove any odditites
	var c = commands;

	// INITIAL OPTIMIZATIONS
	// remove starting ENTER press
	if(c[0].name == "doh.robot.keyPress"
		&& (c[0].args[0] == dojo.keys.ENTER || c[0].args[0] == 77)){
		c.splice(0,1);
	}
	// remove ending CTRL + ALT keypresses in IE
	for(var i = c.length-1; (i >= c.length-2) && (i>=0); i-- ){
		if(c[i].name == "doh.robot.keyPress"
			&& c[i].args[0]==dojo.keys.ALT || c[i].args[0]==dojo.keys.CTRL){
			c.splice(i,1);
		}
	}
	// ITERATIVE OPTIMIZATIONS
	for(i = 0; i<c.length; i++){
		var next, nextdt;
		if(c[i+1]
			&& c[i].name=="doh.robot.mouseMove"
			&& c[i+1].name==c[i].name
			&& c[i+1].args[2]<MOUSEMOVE_MAXIMUM_DELAY){
			// mouse movement optimization
			// if the movement is temporally close, collapse it
			// example: mouseMove(a,b,delay 5)+mouseMove(x,y,delay 10)+mousePress(delay 1) becomes mouseMove(x,y,delay 5)+mousePress(delay 11)
			// expected pattern:
			// 	c[i]: mouseMove
			// 	c[i+1]: mouseMove
			// 	...
			// 	c[i+n-1]: last mouseMove
			// 	c[i+n]: something else
			// result:
			// 	c[i]: last mouseMove
			// 	c[i+1]: something else
			// the c[i] mouse location changes to move to c[i+n-1]'s location, c[i+n] gains c[i+1]+c[i+2]+...c[i+n-1] delay so the timing is the same

			next = c[i+1];
			nextdt = 0;
			while(next
				&& next.name==c[i].name
				&& next.args[2]<MOUSEMOVE_MAXIMUM_DELAY){
				// cut out next
				c.splice(i + 1,1);
				// add next's delay to the total
				nextdt += next.args[2];
				// move to next mouse position
				c[i].args[0]=next.args[0];
				c[i].args[1]=next.args[1];
				next = c[i+1];
			}
			// make the total delay the duration
			c[i].args[3]=nextdt;
		}else if(c[i+1]
			&& c[i].name=="doh.robot.mouseWheel"
			&& c[i+1].name==c[i].name
			&& c[i+1].args[1]<MOUSEMOVE_MAXIMUM_DELAY){
			// mouse wheel optimization
			// if the movement is temporally close, collapse it
			// example: mouseWheel(1,delay 5)+mouseWheel(-2,delay 10) becomes mouseWheel(-1,delay 5, speed 10)
			// expected pattern:
			// 	c[i]: mouseWheel

			// 	c[i+1]: mouseWheel
			// 	...
			// 	c[i+n-1]: last mouseWheel
			// 	c[i+n]: something else
			// result:
			// 	c[i]: mouseWheel
			// 	c[i+1]: something else

			next = c[i+1];
			nextdt = 0;
			while(next
				&& next.name==c[i].name
				&& next.args[1]<MOUSEMOVE_MAXIMUM_DELAY){
				// cut out next
				c.splice(i + 1, 1);
				// add next's delay to the total
				nextdt += next.args[1];
				// add in wheel amount
				c[i].args[0]+=next.args[0];
				next = c[i+1];
			}
			// make the total delay the duration
			c[i].args[2]=nextdt;
		}else if(c[i + 2]
			&& c[i].name=="doh.robot.mouseMoveAt"
			&& c[i+2].name=="doh.robot.scrollIntoView"){
			// swap scrollIntoView of widget and mouseMoveAt
			// the recorder traps scrollIntoView after the mouse click registers, but in playback, it is better to go the other way
			// expected pattern:
			// 	c[i]: mouseMoveAt
			// 	c[i+1]: mousePress
			// 	c[i+2]: scrollIntoView
			// result:
			//	c[i]: scrollIntoView
			//	c[i+1]: mouseMoveAt
			//	c[i+2]: mousePress
			var temp = c.splice(i+2,1)[0];
			c.splice(i,0,temp);
		}else if(c[i + 1]
			&& c[i].name=="doh.robot.mousePress"
			&& c[i+1].name=="doh.robot.mouseRelease"
			&& c[i].args[0]==c[i+1].args[0]){
			// convert mousePress+mouseRelease to mouseClick
			// expected pattern:
			//	c[i]: mousePress
			//	c[i+1]: mouseRelease
			//	mouse buttons are the same
			c[i].name = "doh.robot.mouseClick";
			// delete extra mouseRelease
			c.splice(i + 1,1);
			// if this was already a mouse click, get rid of the next (dup) one
			if(c[i+1] && c[i+1].name == "doh.robot.mouseClick" && c[i].args[0] == c[i+1].args[0]){
				c.splice(i + 1, 1);
			}
		}else if(c[i + 1]
			&& c[i - 1]
			&& c[i - 1].name=="doh.robot.mouseMoveAt"
			&& c[i].name=="doh.robot.mousePress"
			&& c[i+1].name=="doh.robot.mouseMove"){
			// convert mouseMoveAt+mousePress+mouseMove to mouseMoveAt+mousePress+mouseMoveAt+mouseMove
			// this is to kick off dojo.dnd by moving the mouse 1 px
			// expected pattern:
			//	c[i-1]: mouseMoveAt
			//	c[i]: mousePress
			//	c[i+1]: mouseMove

			// insert new mouseMoveAt, 1px to the right
			var cmd={name:"doh.robot.mouseMoveAt",args:[c[i-1].args[0], 1, 100, c[i-1].args[3]+1,c[i-1].args[4]]};
			c.splice(i+1,0,cmd);
		}else if(c[i + 1]
			&& ((c[i].name=="doh.robot.keyPress"
				&& typeof c[i].args[0] =="string")
				|| c[i].name=="doh.robot.typeKeys")
			&& c[i+1].name=="doh.robot.keyPress"
			&& typeof c[i+1].args[0] =="string"
			&& c[i+1].args[1]<=KEYPRESS_MAXIMUM_DELAY
			&& !eval("("+c[i].args[2]+")").ctrl
			&& !eval("("+c[i].args[2]+")").alt
			&& !eval("("+c[i+1].args[2]+")").ctrl
			&& !eval("("+c[i+1].args[2]+")").alt){
			// convert keyPress+keyPress+... to typeKeys
			// expected pattern:
			// 	c[i]: keyPress(a)
			// 	c[i+1]: keyPress(b)
			// 	...
			// 	c[i+n-1]: last keyPress(z)
			// 	c[i+n]: something else
			// result:
			//	c[i]: typeKeys(ab...z)
			//	c[i+1]: something else
			// note: does not convert alt or ctrl keypresses, and does not convert non-character keypresses like enter
			c[i].name = "doh.robot.typeKeys";
			c[i].args.splice(3,1);
			next = c[i+1];
			var typeTime = 0;
			while(next
				&& next.name == "doh.robot.keyPress"
				&& typeof next.args[0] =="string"
				&& next.args[1]<=KEYPRESS_MAXIMUM_DELAY
				&& !eval("("+next.args[2]+")").ctrl
				&& !eval("("+next.args[2]+")").alt){
				c.splice(i + 1,1);
				c[i].args[0] += next.args[0];
				typeTime += next.args[1];
				next = c[i+1];
			}
			// set the duration to the total type time
			c[i].args[2] = typeTime;
			// wrap string in quotes
			c[i].args[0] = "'"+c[i].args[0]+"'";
		}else if(c[i].name == "doh.robot.keyPress"){
			// take care of standalone keypresses
			// characters should be wrapped in quotes.
			// non-characters should be replaced with their corresponding dojo.keys constant
			if(typeof c[i].args[0] == "string"){
				// one keypress of a character by itself should be wrapped in quotes
				c[i].args[0] = "'"+c[i].args[0]+"'";
			}else{
				if(c[i].args[0]==0){
					// toss null keypresses
					c.splice(i,1);
				}else{
					// look up dojo.keys.constant if possible
					for(var j in dojo.keys){
						if(dojo.keys[j] == c[i].args[0]){
							c[i].args[0] = "dojo.keys."+j;
							break;
						}
					}
				}
			}
		}
	}
}

var toggle = function(){
	// summary:
	//	Toggles recording the user's input.
	//	Hotkey: CTRL- ALT-ENTER
	//
	if(!startTime){ start(); }
	else{ stop(); }
}

var stop = function(){
	// summary:
	//	Stops recording the user's input,
	//	and displays the generated code.
	//

	var dt = Math.round((new Date()).getTime() - startTime.getTime());
	startTime = null;
	_optimize();
	var c = commands;
	console.log("Stop called. Commands: " + c.length);
	if(c.length){
		var s = "doh.register('dojox.robot.AutoGeneratedTestGroup',{\n";
		s += "     name: 'autotest" + (testNumber++)+"',\n";
		s += "     timeout: " + (dt+2000)+",\n";
		s += "     runTest: function(){\n";
		s += "          var d = new doh.Deferred();\n";
		for(var i = 0; i<c.length; i++){
			s += "          "+c[i].name+"(";
			for(var j = 0; j<c[i].args.length; j++){
				var arg = c[i].args[j];
				s += arg;
				if(j != c[i].args.length-1){ s += ", "; }
			}
			s += ");\n";
		}
		s += "          doh.robot.sequence(function(){\n";
		s += "               if(/*Your condition here*/){\n";
		s += "                    d.callback(true);\n";
		s += "               }else{\n";
		s += "                    d.errback(new Error('We got a failure'));\n";
		s += "               }\n";
		s += "          }, 1000);\n";
		s += "          return d;\n";
		s += "     }\n";
		s += "});\n";
		var div = document.createElement('div');
		div.id="dojox.robot.recorder";
		div.style.backgroundColor = "white";
		div.style.position = "absolute";
		var scroll = {y: (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
		x: (window.pageXOffset || (window["dojo"]?dojo._fixIeBiDiScrollLeft(document.documentElement.scrollLeft):undefined) || document.body.scrollLeft || 0)};
		div.style.left = scroll.x+"px";
		div.style.top = scroll.y+"px";
		var h1 = document.createElement('h1');
		h1.innerHTML = "Your code:";
		div.appendChild(h1);
		var pre = document.createElement('pre');
		if(pre.innerText !== undefined){
			pre.innerText = s;
		}else{
			pre.textContent = s;
		}
		div.appendChild(pre);
		var button = document.createElement('button');
		button.innerHTML = "Close";
		var connect = dojo.connect(button,'onmouseup',function(e){
			dojo.stopEvent(e);
			document.body.removeChild(div);
			dojo.disconnect(connect);
		});
		div.appendChild(button);
		document.body.appendChild(div);
		commands = [];
	}
}

var getSelector = function(node){
	// Selenium/Windmill recorders have a concept of a "selector."
	// The idea is that recorders need some reference to an element that persists even after a page refresh.
	// For elements with ids, this is easy; just use the id.
	// For other elements, we have to be more sly.

	if(typeof node =="string"){
		// it's already an id to be interpreted by dojo.byId
		return "'" + node+"'";
	}else if(node.id){
		// it has an id
		return "'" + node.id+"'";
	}else{
		// TODO: need a generic selector, like CSS3/dojo.query, for the default return value
		// for now, just do getElementsByTagName
		var nodes = document.getElementsByTagName(node.nodeName);
		var i;
		for(i = 0; i<nodes.length; i++){
			if(nodes[i] == node){
				break;
			}
		}
		// wrap in a function to defer evaluation
		return "function(){ return document.getElementsByTagName('" + node.nodeName+"')["+i+"]; }";
	}
}

var getMouseButtonObject = function(b){
	// convert native event to doh.robot API
	return "{left:" + (b==0)+", middle:" + (b==1)+", right:" + (b==2)+"}";
}


var getModifierObject = function(e){
	// convert native event to doh.robot API
	return "{'shift':" + (e.shiftKey)+", 'ctrl':" + (e.ctrlKey)+", 'alt':" + (e.altKey)+"}";
}

// dojo.connects

dojo.connect(document,"onkeydown",function(e){
	// the CTRL- ALT-ENTER hotkey to activate the recorder
	//console.log(e.keyCode + ", " + e.ctrlKey+", " + e.altKey);
	if((e.keyCode == dojo.keys.ENTER || e.keyCode==77) && e.ctrlKey && e.altKey){
		dojo.stopEvent(e);
		toggle();
	}
});

var lastEvent = {type:""};

var onmousedown = function(e){
	// handler for mouse down
	if(!e || lastEvent.type==e.type && lastEvent.button==e.button){ return; }
	lastEvent={type:e.type, button:e.button};
	var selector = getSelector(e.target);
	var coords = dojo.coords(e.target);
	addCommand("doh.robot.mouseMoveAt",[selector, 0, 100, e.clientX - coords.x, e.clientY-coords.y]);
	addCommand("doh.robot.mousePress",[getMouseButtonObject(e.button-(dojo.isIE?1:0)), 0]);
};

var onclick = function(e){
	// handler for mouse up
	if(!e || lastEvent.type==e.type && lastEvent.button==e.button){ return; }
	lastEvent={type:e.type, button:e.button};
	var selector = getSelector(e.target);
	var coords = dojo.coords(e.target);
	addCommand("doh.robot.mouseClick",[getMouseButtonObject(e.button-(dojo.isIE?1:0)), 0]);
};

var onmouseup = function(e){
	// handler for mouse up
	if(!e || lastEvent.type==e.type && lastEvent.button==e.button){ return; }
	lastEvent={type:e.type, button:e.button};
	var selector = getSelector(e.target);
	var coords = dojo.coords(e.target);
	addCommand("doh.robot.mouseRelease",[getMouseButtonObject(e.button-(dojo.isIE?1:0)), 0]);
};

var onmousemove = function(e){
	// handler for mouse move
	if(!e || lastEvent.type==e.type && lastEvent.pageX==e.pageX && lastEvent.pageY==e.pageY){ return; }
	lastEvent={type:e.type, pageX:e.pageX, pageY:e.pageY};
	addCommand("doh.robot.mouseMove",[e.pageX, e.pageY, 0, 100, true]);
};

var onmousewheel = function(e){
	// handler for mouse move
	if(!e || lastEvent.type==e.type && lastEvent.pageX==e.pageX && lastEvent.pageY==e.pageY){ return; }
	lastEvent={type:e.type, detail:(e.detail ? (e.detail) : (-e.wheelDelta / 120))};
	addCommand("doh.robot.mouseWheel",[lastEvent.detail]);
};

var onkeypress = function(e){
	// handler for key press
	if(!e || lastEvent.type==e.type && (lastEvent.charCode == e.charCode && lastEvent.keyCode == e.keyCode)){ return; }
	lastEvent={type:e.type, charCode:e.charCode, keyCode:e.keyCode};
	addCommand("doh.robot.keyPress",[e.charOrCode==dojo.keys.SPACE?' ':e.charOrCode, 0, getModifierObject(e)]);
};

var onkeyup = function(e){
	if(!e || lastEvent.type==e.type && (lastEvent.charCode == e.charCode && lastEvent.keyCode == e.keyCode)){ return; }
	lastEvent={type:e.type, charCode:e.charCode, keyCode:e.keyCode};
}

// trap all native elements' events
dojo.connect(document,"onmousedown",onmousedown);
dojo.connect(document,"onmouseup",onmouseup);
dojo.connect(document,"onclick",onclick);
dojo.connect(document,"onkeypress",onkeypress);
dojo.connect(document,"onkeyup",onkeyup);
dojo.connect(document,"onmousemove",onmousemove);
dojo.connect(document,!dojo.isMozilla ? "onmousewheel" : 'DOMMouseScroll',onmousewheel);

dojo.addOnLoad(function(){
	// get scrollIntoView for good measure
	// catch: dojo.window might not be loaded (yet?) so addonload
	if(dojo.window){
		dojo.connect(dojo.window,"scrollIntoView",function(node){
			addCommand("doh.robot.scrollIntoView",[getSelector(node)]);
		});
	}
});

// Get Dojo widget events too!
dojo.connect(dojo, "connect",
	function(/*dijit._Widget*/ widget, /*String*/ event, /*Function*/ f){
		// kill recursion
		// check for private variable _mine to make sure this isn't a recursive loop
		if(widget && (!f || !f._mine)){
			var hitchedf = null;
			if(event.toLowerCase() == "onmousedown"){
				hitchedf = dojo.hitch(this,onmousedown);
			}else if(event.toLowerCase() == (!dojo.isMozilla ? "onmousewheel" : 'dommousescroll')){
				hitchedf = dojo.hitch(this,onmousewheel);
			}else if(event.toLowerCase() == "onclick"){
				hitchedf = dojo.hitch(this,onclick);
			}else if(event.toLowerCase() == "onmouseup"){
				hitchedf = dojo.hitch(this,onmouseup);
			}else if(event.toLowerCase() == "onkeypress"){
				hitchedf = dojo.hitch(this,onkeypress);
			}else if(event.toLowerCase() == "onkeyup"){
				hitchedf = dojo.hitch(this,onkeyup);
			}
			if(hitchedf == null){ return; }
			hitchedf._mine = true;
			dojo.connect(widget,event,hitchedf);
		}
	});
})();

});
