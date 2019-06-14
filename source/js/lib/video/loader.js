function loader(v, $v, cb_mid, cb_end) {
	
	var $parent = $v.parentNode,
		$clone = $v.cloneNode(true),
		t = 0, p,
		done = [],
		ev = 'timeupdate';
	console.log('clone', $clone)
	$NS$.dom.attr($clone, {autoplay : 'autoplay', muted : 'muted'});
	$clone.volume = 0;

	$clone.style.display  = 'none';
	$parent.appendChild($clone);

	// $NS$.events.on(clone, 'canplaythrough', function f(e) {
	$NS$.events.on($clone, 'loadedmetadata', function (e) {
		$NS$.events.on($clone, ev, function f(e) {
			var duration = $clone.duration,
				p;
			
			if (t < duration) {
				t =  parseFloat((t + 0.2).toFixed(2));
				p = ~~(100*t/duration);
				seekTo(t);
				
				v.data.trigger('onprogress', [e, t, duration, p]);
				p = ~~(100 * t / duration);
				!done[p] && cb_mid(p);
				done[p] = true;
			} else {
				t = 0;
				$clone.currentTime = 0;
				$NS$.events.off($clone, ev, f);
				cb_end(100);
				$parent.removeChild($clone);
			}
		});
		function seekTo() {
			$clone.currentTime = t;
		}
		seekTo();
	});
}