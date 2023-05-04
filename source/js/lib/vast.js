//
// requires vastParser.js, vastCreative.js
//
$NS$.makeNS('$NS$/vast');
$NS$.vast = (function () {
	$$vast/creative.js$$
	$$vast/vmap.js$$
	$$vast/vpaid.js$$	
	$$vast/parser.js$$

	return {
		parse : function (url) {
			var p = new Parser();
			return p.parse(url);
		}
	}
})(); 
