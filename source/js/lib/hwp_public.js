$NS$.render = function (p) {
	// what about validating p ?
	// 
	return $NS$.engy.render({
		target : p.target,
		content : [{
			component : 'player',
			params : p.settings
		}]
	});
};