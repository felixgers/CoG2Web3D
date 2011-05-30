/**
 * Draft code. For the time being not used in project.
 */

// Provides requestAnimationFrame in a cross browser way.
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

	//<script type="text/javascript" >
	var gl = (function () {
		var d=document, w=window, c=d.getElementById('canvas'),
		gl = c.getContext('experimental-webgl');
		
		function resize() {
			c.width = w.innerWidth-100;
			c.height = w.innerHeight-100;
			gl.viewport(0, 0, c.width, c.height);
		}; resize(); w.addEventListener('resize', resize, false);
		
		return gl;
	})();
	//</script>
	//<script type="text/javascript" src="cog_WebGL.js"></script>
	


	var gl;
	// ... set up WebGL ...

