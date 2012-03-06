var testResourceRe = /^dojo\/tests\//,
	copyOnly = function(mid){
		var list = {
			"dojo/dojo.profile":1,
			"dojo/package.json":1,
			"dojo/OpenAjax":1,
			"dojo/tests":1,
			// these are example modules that are not intended to ever be built
			"dojo/tests/_base/loader/requirejs/requirejs-setup":1,
			"dojo/tests/_base/loader/requirejs/dataMain":1,
			"dojo/tests/_base/loader/requirejs/depoverlap":1,
			"dojo/tests/_base/loader/requirejs/simple-tests":1,
			"dojo/tests/_base/loader/requirejs/relative/relative-tests":1,
			"dojo/tests/_base/loader/requirejs/exports/exports-tests":1
		};
		return (mid in list) || ((/^dojo\/_base\/config\w+$/.test(mid) || /^dojo\/resources\//.test(mid)) && !/\.css$/.test(mid));
	};

var profile = {
	resourceTags:{
		test: function(filename, mid){
			return testResourceRe.test(mid) || mid=="dojo/tests" || mid=="dojo/robot" || mid=="dojo/robotx";
		},

		copyOnly: function(filename, mid){
			return copyOnly(mid);
		},

		amd: function(filename, mid){
			return !testResourceRe.test(mid) && !copyOnly(mid) && /\.js$/.test(filename);
		}
	},

	trees:[
		[".", ".", /(\/\.)|(~$)/]
	]
};
