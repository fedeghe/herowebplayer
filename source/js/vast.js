var targets = [
		"media/vast/document.xml",
		"media/vast/document2.xml",
		"media/vast/hybrid.xml",
		"media/vast/wrapper.xml"
	],
	use = 0;

(function (url) {

	var doc = {},
		docs = [];

	(function get (u) {
		HWP.io.getXML(u, function(cnt){
			var p = $NS$.xmlParser.create(),
				d = p.load(cnt, true).toJson();

			docs.push(d);
			if ('VAST' in d && 'Ad' in d.VAST && 'Wrapper' in d.VAST.Ad && 'VASTAdTagURI' in d.VAST.Ad.Wrapper) {
				get(d.VAST.Ad.Wrapper.VASTAdTagURI['#cdata-section'])
			} else merge();
		}, true);
	})(url);

	function merge() {
		console.log(docs);

		console.log($NS$.util.getType(docs[0].VAST.Ad))
		// set as the first element
		//
		doc = docs[0];

		// proceed
		//
		var i = 1, l = docs.length,
			p = $NS$.Promise.create();



	}

})(targets[use]);
