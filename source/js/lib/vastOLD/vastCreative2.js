/**
 * [VastCreative description]
 * @param {[type]} xml [description]
 */
function VastCreative(xml, options) {
	this.xml = xml;
	this.isLinear = false;
	this.isNonLinear = false;
	this.isCompanionAds = false;
	this.options = options;
	this.type = null;
	this.data = {
		mediaFiles : null,
		videoClicks : {
			clickThrough: null,
			customClick: null,
			clickTracking: []
		},
		trackingEvents : null,
		duration : null,
		companionImage : null,
		companionLabel : null
	};
}
// linear methods
// 

/**
 * [getMediaFiles description]
 * @return {[type]} [description]
 */
VastCreative.prototype.getMediaFiles = function () {
	var self = this,
		res = {
			items : {},
			gifUrl : false
		},
		tmpres = {
			mins : {},
			items : {},
			gifUrl : false
		},
		mediaFiles = $NS$.dom.gebtn(self.xml, 'MediaFiles'),
		mediaFile,
		i = 0, l1 = mediaFiles.length,
		j = 0, l2, type, brate;

	// for (null; i < l1; i++) {
	// 	mediaFile = $NS$.dom.gebtn(mediaFiles[i], 'MediaFile');
	// 	if (mediaFile.length) {
	// 		// filter bitrate
	// 		//
	// 		for (l2 = mediaFile.length; j < l2; j++) {
	// 			type = mediaFile[j].getAttribute('type');
	// 			if (
	// 				// mediaFile[j].getAttribute('type')== self.options.media_type &&
	// 				mediaFile[j].getAttribute('bitrate') > self.options.media_bitrate_min
	// 				&& mediaFile[j].getAttribute('bitrate') < self.options.media_bitrate_max

	// 			) {
	// 				res.items[type] = mediaFile[j].childNodes[0].nodeValue;
	// 			} else {
	// 				$NS$.log('WARNING: ' + mediaFile[j].getAttribute('bitrate') + ' not in [' + self.options.media_bitrate_min + ', '+ self.options.media_bitrate_max + ']');
	// 				$NS$.log('WARNING: edit the bitrate requested for this MediaFile entity OR edit the allowed range (in the build variables json)');
	// 			}

	// 			if (!res.gifUrl && mediaFile[j].getAttribute('type') == 'image/gif') {
	// 				res.gifUrl = mediaFile[j].childNodes[0].nodeValue;
	// 			}
	// 		}
	// 	}
	// }
	


	for (null; i < l1; i++) {

		mediaFile = $NS$.dom.gebtn(mediaFiles[i], 'MediaFile');

		if (mediaFile.length) {

			// filter bitrate, BUT now have to get only the one that
			// has the maximum bitrate that does not violate the bandwidth
			// $NS$.util.connection.Kbps
			//
			for (l2 = mediaFile.length; j < l2; j++) {
				type = mediaFile[j].getAttribute('type');
				brate = ~~(mediaFile[j].getAttribute('bitrate'));
				if (
					


					/*
					
					//
					// IGNORE THE FILTER ABOUT
					//
					
					brate > self.options.media_bitrate_min
					&& brate < self.options.media_bitrate_max &&
					*/

					/*
					ATTENTION
					VAST video specifications (http://www.iab.com/wp-content/uploads/2015/10/IAB_Digital_Video_Ad_Format_Guidelines_Draft_Public_Comment_091615.pdf)
					are specified in Kbps
					 */
					$NS$.util.connection.Kbps > brate
				) {
					//maybe already exists, overwrite only if lower
					//
					if (type in tmpres.items) {

						if (~~(tmpres.items[type].getAttribute('bitrate')) < brate) {
							tmpres.items[type] = mediaFile[j];
						}
						
					} else {

						tmpres.items[type] = mediaFile[j];

					}
					
				} else {
					
					/**
					 * Store the minimum
					 */

					$NS$.log('WARNING: ' + brate + ' not in [' + self.options.media_bitrate_min + ', '+ self.options.media_bitrate_max + "]\n"+
						"or video bitrate( " + brate + " ) <  actual bw: " + $NS$.util.connection.Kbps
					);
					
					
					if (type in tmpres.mins) {
						if (tmpres.mins[type].brate > brate) {
							tmpres.mins[type] = {
								element : mediaFile[j],
								brate : brate
							}
						}
					} else {
						tmpres.mins[type] = {
							element : mediaFile[j],
							brate : brate
						};
					}
				}

				if (!tmpres.gifUrl && mediaFile[j].getAttribute('type') == 'image/gif') {
					tmpres.gifUrl = mediaFile[j].childNodes[0].nodeValue;
				}
			}
			

			// now write on res
			res.gifUrl = tmpres.gifUrl;

			for (var e in tmpres.items) {
				res.items[e] = tmpres.items[e].childNodes[0].nodeValue;
			}




			//---------------------
			// we need webm and mp4 
			//         ====     ===
			//---------------------
			// what if no element in the vast has a bitrate lower than the bw???
			// .... we select the lowest previously stored
			// 
			if (!('video/mp4' in res.items) && 'video/mp4' in tmpres.mins) {
				res.items['video/mp4'] = tmpres.mins['video/mp4'].element.childNodes[0].nodeValue;
				
			}
			if (!('video/webm' in res.items) && 'video/webm' in tmpres.mins) {
				res.items['video/webm'] = tmpres.mins['video/webm'].element.childNodes[0].nodeValue;
			}
			
			


		}
	}


	self.data.mediaFiles = res;
	
	return this;
};

/**
 * [getVideoClicks description]
 * @return {[type]} [description]
 */
VastCreative.prototype.getVideoClicks = function () {
	var self = this,
		res = [],
		videoClicks = $NS$.dom.gebtn(self.xml, 'VideoClicks'),
		clickThrough = [],
		clickTracking = [],
		customClick = [],
		i = 0, l1 = videoClicks.length,
		j = 0, l2,
		tmp;

	for (null; i < l1; i++)  {
		tmp = $NS$.dom.gebtn(videoClicks[i], 'ClickThrough');
		tmp.length && clickThrough.push(tmp[0].childNodes[0].nodeValue);

		tmp = $NS$.dom.gebtn(videoClicks[i], 'ClickTracking');
		
		if(tmp.length){
			clickTracking.push(tmp[0].childNodes[0].nodeValue);
		}

		tmp = $NS$.dom.gebtn(videoClicks[i], 'CustomClick');
		tmp.length && customClick.push(tmp[0].childNodes[0].nodeValue);
	}
	
	
	clickThrough.length && (self.data.videoClicks.clickThrough = clickThrough[0]);
	customClick.length && (self.data.videoClicks.customClick = customClick[0]);
	clickTracking.length && self.data.videoClicks.clickTracking.push( clickTracking[0]);

	return this;
};

/**
 * [getTrackingEvents description]
 * @return {[type]} [description]
 */
VastCreative.prototype.getTrackingEvents = function () {
	var self = this,
		trackingEvents = $NS$.dom.gebtn(self.xml, 'TrackingEvents'),
		res = {},
		tmp = [],
		t,
		i = 0, l1 = trackingEvents.length,
		j = 0, l2;
	for (null; i < l1; i++) {
		tmp = $NS$.dom.gebtn(trackingEvents[i], 'Tracking');
		l2 = tmp.length;
		for (j = 0; j < l2; j++) {
			t = tmp[j].getAttribute('event').match(/^start$|^firstQuartile|^midpoint|^thirdQuartile|^complete|^mute|^unmute|^pause$|^resume$|^fullscreen$/);
			if (t && t.length) {
				// queue
				if (!(t[0] in res)) {
					res[t[0]] = [];
				}
				res[t[0]].push(tmp[j].childNodes[0].nodeValue);
			}
		}
	}
	
	self.data.trackingEvents = res;
	return this;
};

/**
 * [getDuration description]
 * @return {[type]} [description]
 */
VastCreative.prototype.getDuration = function () {
	var self = this,
		res = 0,
		tmp,
		duration = $NS$.dom.gebtn(self.xml, 'Duration')[0];
	if (duration) {
		tmp = duration.childNodes[0].nodeValue.split(':');
		res = ~~tmp[0] * 3600 + ~~tmp[1] * 60 + ~~tmp[2];
	}
	self.data.duration = res;
	return this;
};



// companions Methods
// 
VastCreative.prototype.getImage = function () {
	
	var self = this,
		companionAds = $NS$.dom.gebtn(self.xml, 'CompanionAds');

	if (companionAds && companionAds.length) {
		tmp = $NS$.dom.gebtn(companionAds[0], 'StaticResource');
		tmp && tmp.length && (self.data.companionImage = tmp[0].childNodes[0].nodeValue);
	}
	
	return this;
};
VastCreative.prototype.getBrandLabel = function () {
	
	var self = this,
		companionAds = $NS$.dom.gebtn(self.xml, 'CompanionAds');

	if (companionAds && companionAds.length) {
		tmp = $NS$.dom.gebtn(companionAds[0], 'HTMLResource');
		tmp && tmp.length && (self.data.companionLabel = tmp[0].childNodes[0].nodeValue);
	}
	
	return this;
};

