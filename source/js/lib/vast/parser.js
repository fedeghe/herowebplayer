function Parser() {}

Parser.prototype.parse = function (url) {
	var doc = {},
		docs = [],
		pro = $NS$.Promise.create();

	(function get (u) {
		HWP.io.getXML(u, function(cnt){
			var p = HWP.xmlParser.create(),
				d = p.load(cnt, true).toJson();

			docs.push(d);
			if ('VAST' in d && 'Ad' in d.VAST && 'Wrapper' in d.VAST.Ad && 'VASTAdTagURI' in d.VAST.Ad.Wrapper) {
				get(d.VAST.Ad.Wrapper.VASTAdTagURI['#cdata-section'])
			} else merge();
		}, true);
	})(url);

	function merge() {
		console.log(docs);
		pro.done(docs);
		/*
		console.log(HWP.util.getType(docs[0].VAST.Ad))
		// set as the first element
		//
		doc = docs[0];

		// proceed
		//
		var i = 1, l = docs.length,
			p = HWP.Promise.create();
		*/
	}
	return pro;
};