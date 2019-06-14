$NS$.makeNS('$NS$/track', function () {
	var lib = (function () {
		var endPoint = "$EVENTS.TRACKING.ENTRY_POINT$",
			data = {},
			interacted = false;
		function do_event(ev){
			$NS$.io.getJson(
				endPoint,
				function () {},
				$NS$.object.extend(data, {
					"event" : ev + ""
				}),
				false, // no cors
				true   // be async
			);
			return true;
		}
		function do_dynamicClick(ev, url){
			$NS$.io.getJson(
				endPoint,
				function () {
					window.open(url);
				},
				$NS$.object.extend(data, {
					"event" : ev + "",
					clickUrl : url
				}),
				false, // no cors
				true   // be async
			);
			return true;
		}
		return {
			"event" : do_event,
			dynamicClick : do_dynamicClick
		};
	})();


	return {
		"event" : function(p) {
			return !$NS$.mute && lib['event'](p);
		},
		dynamicClick : function (p1, p2) {
			return !$NS$.mute && lib.dynamicClick(p1, p2);
		},
		iframe : function (url) {
			var i = document.createElement('iframe');
			i.style = "display:none;width:1px;height:1px";
			i.onload = function () {
				i.parentNode.removeChild(i);
			}
			document.body.appendChild(i);
			i.src = url;
		},
		pixel : function (pixel_url) {
			if($NS$.mute) return false;

			if ($NS$.util.isArray(pixel_url)) {
				for (var i = 0, l = pixel_url.length; i < l; i++) {
					$NS$.track.pixel(pixel_url[i]);
				}
			}
			var i = new Image(1, 1);
			i.src = pixel_url;
			return true;
		}
	};
});