function Timelapse (node, ep_or_fun, width, height) {
	this.node = node;
	this.node.style.width = width + 'px';
	this.node.style.height = height + 'px';
	// create an eventClock with the correct entryPoint
	//
	this.eventClock = new EventClock(ep_or_fun);
}

Timelapse.prototype.init = function (){
	var self = this;

	$NS$.livebox({
		// the target is always the iframe
		// 
		target: self.node,

		// the 'whenVisible' function, called automatically from within the 
		// inRead library as far as the target center pixel become visible
		// 
		whenVisible: function () {self.awake();},

		// instead, the requirements states that the collapsing is NOT driven by visibility
		// but by events that happens on the content;
		// e.g. the video with sm_inRead=true this event is the end of the video;
		// e.g. the video with a falsy sm_inRead (not set or false) never collapse
		// 
		whenInvisible: function (){self.sleep();},

		once: false //... true by default
	});
};
Timelapse.prototype.awake = function () {
	//console.warn(this.node, ' timelapse visible');
	this.eventClock.start();
};

Timelapse.prototype.sleep = function () {
	//console.warn(this.node, ' timelapse invisible');
	this.eventClock.stop();
};

