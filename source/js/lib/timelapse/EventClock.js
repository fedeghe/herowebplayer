function EventClock(ep_OR_fun) {
	this.burstCount = 0;
	this.ep_OR_fun = ep_OR_fun;
	this.trackingMode = typeof ep_OR_fun;
	this.awakeTime = $TIMELAPSE.START_DELAY$;
	this.endOfTracking = $TIMELAPSE.END_OF_TIMES$;
	this.startTimeout = null;
	this.eventInterval = null;
	this.ti = 0;
	this.tot = 0;
	this.tmp = 0;
	this.delay = null;
	this.lastSeen = 0;
	this.rnd = +new Date;
}

EventClock.interval = 1E3 / $TIMELAPSE.FREQUENCY$;

/**
 * 
 */
EventClock.prototype.start = function () {
	var self = this;

	if (self.tot > self.endOfTracking) {return;}

	self.startTimeout = setTimeout(function () {

		if (self.tot > self.endOfTracking) {return;}

		self.tmp = +new Date;
		self.delay = self.burstCount ? self.tmp - self.lastSeen : 0;

		self.eventInterval = setInterval(function () {
			
			if (self.tot > self.endOfTracking) {
				clearInterval(self.eventInterval); return;
			}

			self.ti++;
			self.tot += EventClock.interval;

			self.track();

		}, EventClock.interval);
	}, self.awakeTime);

};

/**
 * 
 */
EventClock.prototype.track = function () {
	var self = this,
		img, body = document.body,
		params = {
			time : (self.tot/1e3).toFixed(1),
			burstCount : self.burstCount,
			cachebuster : self.rnd
		};
	switch (self.trackingMode) {
		case 'string' : 
			img = new Image();
			img.style.width = '1px';
			img.style.height = '1px';
			img.style.display = 'none';
			img.onload = function () {
				body.removeChild(img);
			};
			body.appendChild(img);
			img.src = self.ep_OR_fun
				.replace(/%tl_time%/, params.time)
				.replace(/%tl_burstcount%/, params.burstCount)
				.replace(/%tl_cachebuster%/, params.cachebuster);	
			break;
		case 'function' :
			self.ep_OR_fun(params);
			break;
	}	
};

/**
 * 
 */
EventClock.prototype.stop = function () {
	var self = this;
	self.lastSeen = new Date;
	self.burstCount++;
	self.awakeTime = EventClock.interval - ((this.lastSeen - self.tmp) % EventClock.interval);
	clearInterval(self.eventInterval);
	clearTimeout(self.startTimeout);
};

