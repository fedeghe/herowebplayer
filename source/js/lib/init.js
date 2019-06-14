$NS$.proto = (function () {
	return document.location.protocol.match(/^https?:$/) ? document.location.protocol : '$DEFAULT_PROTO$';
})();