/**
 * Constructor for the main object theat will get and parse the 
 * @param {[type]} vastUrl [description]
 */
function VastParser(vastUrl, options) {
	/**
	 * the vast complete xml
	 * @type Document
	 */
	this.xml = false;

	/**
	 * the object that will be filled out parsing
	 * the xml
	 * @type Object Literal
	 */
	this.oVast = {
		impressions : [],
		linears : [],
		nonlinears : [],
		companions : []
	};

	/**
	 * the original vast url requested
	 * @type {String} the vast url
	 */
	this.vastUrl = vastUrl;

	/**
	 * an array containing all the creative xml subtrees,
	 * used only internally
	 * @type {Array}
	 */
	this.creativesXML = [];

	/**
	 * here will be stored the instances of another javascript object
	 * to represente each creative (see the VastCreative constructor)
	 * @type {Array}
	 */
	this.creatives = {
		linear : [],
		nonlinear : [],
		companions : []
	};

	/**
	 * Impressions are global, will be stored here, not at creative level
	 * @type {Array}
	 */
	this.impressions = [];

	this.options = options;

	/**
	 * the parser promise returned and solved when parsing is completed
	 * @type {[type]}
	 */
	this.promise = $NS$.Promise.create();


	/**
	 * container for url used in a wrapper chain to check for loops
	 * @type {Array}
	 */
	this.vastUrls = [vastUrl];

	// start
	//
	this.init();
}

/**
 * Intialization function lauches the xml retrival
 * which in the xhr callback will start the parser
 * 
 * @return void
 */
VastParser.prototype.init = function () {
	this.getXML();
};

/**
 * [getXML description]
 * @return {[type]} [description]
 */
VastParser.prototype.getXML = function (forceStraight) {
	var self = this;
	// 302bug, vast wrappers & co.
	// ---------------------------
	// The 302bug affects safari (and now even chrome) disallowing the browser to
	// proceed correctly when the vastUrl redirects starts a chain of 302 (CORS related)
	// to overcome this on the server side we should NEVER answer with a 302, but we still need
	// to check the params of url1 and give back a url2 (maybe nesting some steps)...and at
	// the end get the url of the final vast xml.
	// 
	// The solutions adopted here are two:
	// - on the server side we answer a vast wrapper with contains in the appropriate field
	// 	 'VASTAdTagURI' the url2 value
	// - on the server side answer to url1 giving back a json which contains url2 as:
	// 	 {vastUrl: "//:......"}
	// 	 
	// Being clear that the first one is more clean and appropriate, this will be the default,
	// but when needed the second solution ONE must explicitly declare
	// sm_vast302=true
	// in the creative code by hand, doing that will be used the xhr.getJson and will be 
	// made another request to the url found in the 'vastUrl' field obtained from the first request
	// 
	// The vastParser
	// --------------
	// the vastParser can handle a chain of vast wrappers
	// 	 
	(self.options.vast302 && !forceStraight) ?
		
	//
		//	in this case the first request ALWAYS returns a json like
		//	{
		//		vastUrl : "http://...the url meant to be returned by the 302"
		//	}
		//	all following wrappers (if any) will be direct
		//
		$NS$.io.getJson(self.vastUrl, function (res) {
			res && res.vastUrl && $NS$.io.getXML(res.vastUrl, go, true);
		}, true)
	    
		//
		// otherwise it means
		//
		: $NS$.io.getXML(self.vastUrl, go, true);

	function go (r) {
		
		/*try{*/
			// if the vast is not valid
			// - r will be falsy
			// OR
			// - the first child nodename will  not be vast
			// then shut up
			// 
			if (!r || (r.children.length == 1 && !r.children[0].nodeName.match(/vast/i) ) ) {
				$NS$.MsgHub.sender(window.parent)('destroyInRead' + '_' + $NS$.aid);
				throw 'XML non valid';
				return;
			}
			self.xml = r;
			//
			// check if is a wrapper,
			// if yes unwrap it to get trackings  
			// otherwise proceed since it is the last one
			// 
			self[self.wrapperCheck() ? 'unwrap' : 'parse']();
			/*
		}catch(e){
			return;
		}*/
	}
	
};


VastParser.prototype.wrapperCheck = function () {
	return !!($NS$.dom.gebtn(this.xml, 'Wrapper').length)
};

/**
 * [unwrap description]
 * @return {[type]} [description]
 */
VastParser.prototype.unwrap = function () {
	var self = this,
		retPromise = $NS$.Promise.create(),
		nextVastUrl = $NS$.dom.gebtn(self.xml, 'VASTAdTagURI')[0].childNodes[0].nodeValue,
		loopDetected = self.doesItCauseLoop(nextVastUrl);
	self.getImpressions();
	self.getCreatives();
	if (!loopDetected) {
		
		self.vastUrl = nextVastUrl;

		self.getXML(true);	
	} else {
		$NS$.Channel.get(self.options.ChannelID).pub('noLinearsShutUpInRead');
	}
};



/**
 * [parse description]
 * @return {[type]} [description]
 */
VastParser.prototype.parse = function () {




	var self = this,
		newCreatives = [],
		i = 0,
		l,
		te, vc;
	

	this.getImpressions();
	this.getCreatives();
	// this.parseCreatives();


	function objMerge (destObj, sourceObj, field) {
		// field -> 'complete'
		// destObj -> te
		// sourceObj -> self.creatives.linear[i].data.trackingEvents
		(field in destObj) && $NS$.util.isArray(destObj[field]) && 
		(field in sourceObj) && $NS$.util.isArray(sourceObj[field]) && 
		sourceObj[field].length &&
		destObj[field].push(sourceObj[field][0]);


		// ('complete' in te) &&
		// ('complete' in self.creatives.linear[i].data.trackingEvents) &&
		// te.complete.push(self.creatives.linear[i].data.trackingEvents.complete[0]);
	}
	
	l = self.creatives.linear.length;

	// in the case of the even one wrapper we should consider
	// that the parser should return just one, so we must:
	// - merge the impressions
	// - merge tracking events
	// - take care only of the last Clickthrough
	// - merge all the ClickTracking
	// 
	if (l > 1) {
		
		//
		// first of all insert the most important one..... the last
		//
		
		newCreatives.push(self.creatives.linear[l-1]);
		te = newCreatives[0].data.trackingEvents;
		vc = newCreatives[0].data.videoClicks;
		
		for (null; i < l-1; i++){
			
			// ('firstQuartile' in te) && 
			// ('firstQuartile' in self.creatives.linear[i].data.trackingEvents) && 
			// te.firstQuartile.push(self.creatives.linear[i].data.trackingEvents.firstQuartile[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'firstQuartile');

			// ('midpoint' in te) && 
			// ('midpoint' in self.creatives.linear[i].data.trackingEvents) && 
			// te.midpoint.push(self.creatives.linear[i].data.trackingEvents.midpoint[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'midpoint');

			// ('thirdQuartile' in te) &&
			// ('thirdQuartile' in self.creatives.linear[i].data.trackingEvents) &&
			// te.thirdQuartile.push(self.creatives.linear[i].data.trackingEvents.thirdQuartile[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'thirdQuartile');

			// ('complete' in te) &&
			// ('complete' in self.creatives.linear[i].data.trackingEvents) &&
			// te.complete.push(self.creatives.linear[i].data.trackingEvents.complete[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'complete');

			// ('fullscreen' in te) && 
			// ('fullscreen' in self.creatives.linear[i].data.trackingEvents) && 
			// te.fullscreen.push(self.creatives.linear[i].data.trackingEvents.fullscreen[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'fullscreen');

			// ('mute' in te) &&
			// ('mute' in self.creatives.linear[i].data.trackingEvents) &&
			// te.mute.push(self.creatives.linear[i].data.trackingEvents.mute[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'mute');

			// ('unmute' in te) && 
			// ('unmute' in self.creatives.linear[i].data.trackingEvents) && 
			// te.unmute.push(self.creatives.linear[i].data.trackingEvents.unmute[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'unmute');

			// ('pause' in te) && 
			// ('pause' in self.creatives.linear[i].data.trackingEvents) && 
			// te.pause.push(self.creatives.linear[i].data.trackingEvents.pause[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'pause');

			// ('resume' in te) && 
			// ('resume' in self.creatives.linear[i].data.trackingEvents) && 
			// te.resume.push(self.creatives.linear[i].data.trackingEvents.resume[0]);
			objMerge(te, self.creatives.linear[i].data.trackingEvents, 'resume');

			('clickTracking' in vc) &&
			$NS$.util.isArray(vc.clickTracking) && 
			('clickTracking' in self.creatives.linear[i].data.videoClicks) &&
			vc.clickTracking.push(self.creatives.linear[i].data.videoClicks.clickTracking[0]);

			// force the clickThrough
			// as a clickTrakcing  (only for those found on the wrappers)
			//
			('clickThrough' in vc) &&
			$NS$.util.isArray(vc.clickThrough) && 
			('clickThrough' in self.creatives.linear[i].data.videoClicks) &&
			vc.clickTracking.push(self.creatives.linear[i].data.videoClicks.clickThrough);
		}
		self.creatives.linear = newCreatives;

		// now it is safe to disarm the $NS$.MsgHub.kill function 
		// 
		
		
		// delete $NS$.MsgHub.kill;
	}


	this.buildVastObject();
};


/**
 * [buildVastObject description]
 * @return {[type]} [description]
 */
VastParser.prototype.buildVastObject = function () {
	var self = this,
		i = 0,
		c;

	for (c in self.creatives) {
		i = 0,
	
		l = self.creatives[c].length;

		for (null; i < l; i++) {

			(function (creative, type) {
				var res = {
					linear : function f(c) {	
						// $NS$.log('Linear');
						// $NS$.log(c);
						self.oVast.linears.push(c.data);
					},
					nonlinear : function f(c) {
						// $NS$.log('Non linear');
						// $NS$.log(c);
						self.oVast.nonlinears.push(c.data);
					},
					companions : function f(c) {
						// $NS$.log('Companions');
						// $NS$.log(c);
						self.oVast.companions.push(c.data);
					}
				}[type](creative);

			})(self.creatives[c][i], self.creatives[c][i].type);
		}
	}
	self.promise.done(this.oVast);
	
};


VastParser.prototype.getPromise = function () {
	return this.promise;
};

/**
 * [getImpressions description]
 * @return {[type]} [description]
 */
VastParser.prototype.getImpressions = function () {
	var self = this,
		impressions = $NS$.dom.gebtn(this.xml, 'Impression'),
		i = 0, l = impressions.length;
	
	for (null; i < l; i ++) {
		self.oVast.impressions.push(impressions[i].childNodes[0].nodeValue);
	}
};

/**
 * [getCreatives description]
 * @return {[type]} [description]
 */
VastParser.prototype.getCreatives = function () {
	var self = this,
		creativesXML = $NS$.dom.gebtn(this.xml, 'Creative'),
		i = 0, l = creativesXML.length;

	if (l == 0) {
	
		$NS$.Channel.get(self.options.ChannelID).pub('noLinearsShutUpInRead');
		return;
	}
	
	for (null; i < l; i ++) {
		self.creativesXML.push(creativesXML[i]);
	}
	self.parseCreatives(creativesXML);
};

/**
 * [parseCreatives description]
 * @return {[type]} [description]
 */
VastParser.prototype.parseCreatives = function (Cres) {
	var self = this,
		j = 0,
		l = Cres.length;
	
	for (null; j < l; j++) {
		(function (i, tmp) {
			// self.creatives[i] = new VastCreative(self.creativesXML[i], self.options);
			tmp = new VastCreative(Cres[i], self.options);

			tmp.isLinear = $NS$.dom.gebtn(Cres[i], 'Linear'),
			tmp.isNonLinear = $NS$.dom.gebtn(Cres[i], 'NonLinear'),
			tmp.isCompanionAds = $NS$.dom.gebtn(Cres[i], 'CompanionAds');
			
			if (tmp.isLinear.length) {
				tmp.type = 'linear';
				self.creatives.linear.push(tmp);
				self.parseLinear(tmp);
			} else if (tmp.isNonLinear.length) {
				tmp.type = 'nonlinear';
				self.creatives.nonlinear.push(tmp);
				self.parseNonLinear(tmp);
			} else if (tmp.isCompanionAds.length) {
				tmp.type = 'companions';
				self.creatives.companions.push(tmp);
				self.parseCompanionAds(tmp);
			}
		})(j);
	}
};


/**
 * [checkLoops description]
 * @param  {[type]} u [description]
 * @return {[type]}   [description]
 */
VastParser.prototype.doesItCauseLoop = function (u) {
	var self = this;
	
	try {
		if ($NS$.util.arrayFind(self.vastUrls, u) >= 0) {
			throw "loop detected trying to push " + u;
			
		} else {
			self.vastUrls.push(u);
		}
	} catch(err) {
		console.debug('ERROR : ' + err);
		console.debug(self.vastUrls);
		return true;
	}
	return false;
};


/**
 * [parseLinear description]
 * @param  {[type]} Cre [description]
 * @return {[type]}     [description]
 */
VastParser.prototype.parseLinear = function (Cre) {

	// $NS$.log('-------------------');
	// $NS$.log('PARSING linear ad: ');
	Cre.getMediaFiles()
		.getVideoClicks()
		.getTrackingEvents()
		.getDuration();
	// $NS$.log('...done');
};

/**
 * [parseNonLinear description]
 * @param  {[type]} Cre [description]
 * @return {[type]}     [description]
 */
VastParser.prototype.parseNonLinear = function (Cre) {
	// $NS$.log('-------------------');
	// $NS$.log('>>> PARSING non linear ad: NOT IMPLEMENTED YET');
	// $NS$.log(Cre);
};

/**
 * [parseCompanionAds description]
 * @param  {[type]} Cre [description]
 * @return {[type]}     [description]
 */
VastParser.prototype.parseCompanionAds = function (Cre) {
	// $NS$.log('-------------------');
	// $NS$.log('>>> PARSING companion ad: NOT IMPLEMENTED YET');
	// $NS$.log(Cre);
	Cre.getImage().getBrandLabel();
};