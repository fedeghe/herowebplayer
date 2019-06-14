$NS$.makeNS('$NS$/css', function () {
	var _ = {
			gotFontAwesome : false,
			gotSignify : false
		},
		bg;

	function style(el, prop, val ) {

		if (!el) return false;

		var prop_is_obj = (typeof prop === 'object' && typeof val === 'undefined'),
			ret = false,
			newval, k;

		if (!prop_is_obj && typeof val === 'undefined') {

			ret = el.currentStyle ? el.currentStyle[prop] : el.style[prop];
			return ret;
		}

		if (prop_is_obj) {
			for (k in prop) {
				el.style[k] = prop[k];
			}
		} else if (typeof val !== 'undefined') {
			val += '';

			el.style[prop] = val;

			if (prop === 'opacity') {
				el.style.filter = 'alpha(opacity = ' + (~~(100 * parseFloat(val, 10))) + ')';
			}
			
		}
		return true;
	};

	function fontAwesome() {
		if(_.gotFontAwesome) return;
		var fa = document.createElement('link');
		fa.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css';
		fa.rel = 'stylesheet';
		document.getElementsByTagName('head').item(0).appendChild(fa);
		_.gotFontAwesome = true;
	};
	function signify () {
		if (_.gotSignify) return;
		var fa = document.createElement('link');
		fa.href = $NS$.proto + '$SIGNIFY_PATH$';
		fa.rel = 'stylesheet';
		document.getElementsByTagName('head').item(0).appendChild(fa);
		_.gotSignify = true
	}


	function setZoom(el, zoom, origin) {

		origin = origin || [ 0.5, 0.5 ];

		var p = [ "webkit", "moz", "ms", "o" ],
			s = "scale(" + zoom + ")",
			oString = (origin[0] * 100) + "% " + (origin[1] * 100) + "%";

		for (var i = 0; i < p.length; i++) {
			el.style[p[i] + "Transform"] = s;
			el.style[p[i] + "TransformOrigin"] = oString;
		}

		el.style["transform"] = s;
		el.style["transformOrigin"] = oString;
	}

	bg = (function () {

		var speed = 0.6,
			steps = 15,
			to = 1000 * speed / steps,
			transparency = 0.3,
			baseColorTpl = "rgba(%r%,%g%,%b%,%a%)",
			transp = "rgba(0,0,0,0)",
			tpls = [
				"-webkit-linear-gradient(left, %rgbaElements%)",
				"-o-linear-gradient(right, %rgbaElements%)",
				"-moz-linear-gradient(right, %rgbaElements%)",
				"linear-gradient(to right, %rgbaElements%)"

				// "-webkit-radial-gradient(left, %rgbaElements%)",
				// "-o-radial-gradient(right, %rgbaElements%)",
				// "-moz-radial-gradient(right, %rgbaElements%)",
				// "radial-gradient(to right, %rgbaElements%)"
			],
			done = function () {},
			node,
			color,
			moving = false,
			cursor,
			start, end,
			versus,
			moves;

		function move() {

			moving = true;

			var rgbElements = [],
				tmp,
				i = 0,
				l = tpls.length;
			for (null; i < steps; i++) {
				rgbElements.push(i == cursor ? color : transp);
			}
			tmp = rgbElements.join(',');

			for (i = 0; i < l; i++) {
				$NS$.css.style(node, 'background', $NS$.util.replaceAll(tpls[i], {rgbaElements: tmp}));
			}

			if (cursor != end) {
				cursor += versus;
				setTimeout(move, to);
			} else {
				clean();
				done();
				moving = false;
			}
		}

		function clean() {
			$NS$.css.style(node, 'background', 'none');
		}


		// $NS$.css.bg.moveR(node, [255,255,255]);
		function moveR(elem, c) {
			node = elem;
			color = $NS$.util.replaceAll(baseColorTpl, {r:c[0],g:c[1],b:c[2],a:transparency});
			start = 0;
			end = steps - 1;
			versus = 1;
			cursor = start;
			move();
		}
		function moveL(elem, c) {
			node = elem;
			color =  $NS$.util.replaceAll(baseColorTpl, {r:c[0],g:c[1],b:c[2],a:transparency});
			start = steps - 1;
			end = 0;
			versus = -1;
			cursor = start;
			move();
		}

		return {
			moveR : moveR,
			moveL : moveL,
			moveRL : function (elem, c) {
				done = function () {
					done = function () {};
					moveL(elem, c);
				};
				moveR(elem, c);
			},
			moveLR : function (elem, c) {
				done = function () {
					done = function () {};
					moveR(elem, c);
				};
				moveL(elem, c);
			}
		};

	})();


	return {
		style : style,
		setZoom : setZoom,
		bg : bg,
		fontAwesome : fontAwesome,
		signify : signify
	};

});


