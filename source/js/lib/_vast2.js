//
// requires vastParser.js, vastCreative.js
//
$NS$.makeNS('$NS$/vast');
$NS$.vast = (function () {

	$$lib/vast/vastParser2.js$$
	$$lib/vast/vastCreative2.js$$


	var doClickThrough,
		clickTroughActive = false,
		msgReceiver = $NS$.MsgHub.receiver(window),
		msgSender = $NS$.MsgHub.sender(window.parent),
		impressionsDelay = 2000;

	function initVast(videoPlayer, vast_url, ChannelID, progress/*, skippable*/){

		var videoPlayerID = $NS$.util.uniqueid + '',
			options = {
				'media_bitrate_min' : $MEDIA_BITRATE_MIN$,
				'media_bitrate_max' : $MEDIA_BITRATE_MAX$,
				'media_type' : 'video/mp4',
				'ad_caption': 'Advertisement',
				vast302 : $NS$.vast302,
				ChannelID : ChannelID,
				progress : !!progress
			},
			wrapDIV = document.createElement('div'),

			// returning promise for use result later on
			// 
			pro = $NS$.Promise.create(),
			skippableButton;

		videoPlayer.setAttribute('id', videoPlayerID);

				
		// wrap
		// 
		wrapDIV.className = 'vastWrapper pos_center_container';
		wrapDIV.id = 'vastWrapper_'+ videoPlayerID;
		videoPlayer.parentNode.insertBefore(wrapDIV, videoPlayer);
		wrapDIV.appendChild(videoPlayer);	
		wrapDIV.style.position = 'relative';		
		


		
		// get the promise, and proceed when done parsing
		// 
		ReadFile(vast_url, options).then(function (p, response) {
			var oVast = response[0];

			// maybe a companion brings a logo and a label
			// 
			if (oVast.companions.length
				&& oVast.companions[0].companionImage
				&& oVast.companions[0].companionLabel) {
				
				$NS$.Channel.get(options.ChannelID).pub('foundCompanion', [
			 		oVast.companions[0].companionImage,
			 		oVast.companions[0].companionLabel
			 	]);
			}
			
			// SOLVE ONLY IF IN THE END THERE'S A USABLE LINEAR
			//
			if (oVast.linears.length) {

				
				// add methods to video
				// and obtain a promise to be sure to solve the outer
				// promise for the parser ONLY when done
				
				Play(videoPlayerID, oVast, options).then(function() {
					
					// solve the promise returned by the intVast
					// .. this NEEDS ABSOLUTELY the new methods on video
					// introduced by the Play function ...
					
					pro.done(oVast);
				});

				
			}
		});
		return pro;
	}

	

	function straightVast (videoPlayer, response, ChannelID, progress/*, skippable*/) {
		var videoPlayerID = $NS$.util.uniqueid + '',
			options = {
				'media_bitrate_min' : $MEDIA_BITRATE_MIN$,
				'media_bitrate_max' : $MEDIA_BITRATE_MAX$,
				'media_type' : 'video/mp4',
				'ad_caption': 'Advertisement',
				ChannelID : ChannelID,
				progress : !!progress
			},
			wrapDIV = document.createElement('div'),

			// returning promise for use result later on
			pro = $NS$.Promise.create(),
			oVast = response[0],
			skippableButton;

		videoPlayer.setAttribute('id', videoPlayerID);

		// wrap
		// 
		wrapDIV.className = 'vastWrapper  pos_center_container';
		wrapDIV.id = 'vastWrapper_'+ videoPlayerID;
		videoPlayer.parentNode.insertBefore(wrapDIV, videoPlayer);
		wrapDIV.appendChild(videoPlayer);	
		wrapDIV.style.position = 'relative';

		
/*
		if ($NS$.IN_READ && skippable) {
			// addSkippableButton(wrapDIV);
		}
*/

		
		Play(videoPlayerID, oVast, options).then(function (){
			// maybe a companion brings a logo and a label
			//
			if (oVast.companions.length
				&& oVast.companions[0].companionImage
				&& oVast.companions[0].companionLabel
			) {
				$NS$.Channel.get(options.ChannelID).pub('foundCompanion', [
					oVast.companions[0].companionImage,
					oVast.companions[0].companionLabel
				]);
			}	
		});

		
	}

	function ReadFile(vast_url, options){
		return (new VastParser(vast_url, options)).getPromise();
	}

	function Play(videoPlayerID, oVast, options) {
		
		if ($NS$.IN_READ && !oVast.linears.length) {

			$NS$.Channel.get(options.ChannelID).pub('noLinearsShutUpInRead');
			return false;
		}

		var isMobile = $NS$.util.isMobile() || $NS$.fakeMobile,
			videoPlayer = document.getElementById(videoPlayerID),
			progress = 'progress' in options && options.progress,
			linear = oVast.linears[0],

			playHasDone = $NS$.Promise.create();
			done = {
				start : false,
				first : false,
				mid : false,
				third : false,
				complete : false
			},/*
			_play = function(event) {

				// On content load
				//
				var _loaded = function(event) {

						videoPlayer.removeEventListener('loadedmetadata', _loaded);

					},
					_ended = function(event) {
						_removeClickThrough(videoPlayerID);
						videoPlayer.removeEventListener('ended', _ended);
					};
				
				_loaded();

				videoPlayer.addEventListener('loadedmetadata', _loaded);
				videoPlayer.addEventListener('ended', _ended);
				videoPlayer.removeEventListener('play', _play);

				// once for all
				debugger;
				videoPlayer.addEventListener('timeupdate', function () {
					var current_time = Math.floor(videoPlayer.currentTime)
					$NS$.Channel.get(options.ChannelID).pub('video_progress', [~~(100 * (current_time/linear.duration))]);
				});
			},*/
			_timeupdate  = function(event) {

				var current_time = Math.floor(videoPlayer.currentTime),
					i,l;

				// can happen that the vast has not this info then we try
				// to use the one from the video element
				// 
				
				if (
					// linear.duration == 0 &&
					'duration' in videoPlayer &&
					videoPlayer.duration) {
					linear.duration = videoPlayer.duration;

				}

				if (!done.start && current_time >= 0) {
					if (linear.trackingEvents.start != null && linear.trackingEvents.start.length) {
						// loop the queue
						//
						for (i = 0, l = linear.trackingEvents.start.length; i < l; i++) {
							$NS$.track.pixel(linear.trackingEvents.start[i]);
						}
						done.start = true;
					}
				}
				if (!done.first && current_time >= Math.floor(linear.duration/4)) {
					if (linear.trackingEvents.firstQuartile != null && linear.trackingEvents.firstQuartile.length) {
						//loop the queue
						for (i = 0, l=linear.trackingEvents.firstQuartile.length; i < l; i++) {
							$NS$.track.pixel(linear.trackingEvents.firstQuartile[i]);
						}
						done.first = true;
					}
				}
				if (!done.mid && current_time >= Math.floor(linear.duration/2)) {
					if (linear.trackingEvents.midpoint != null && linear.trackingEvents.midpoint.length) {
						//loop the queue
						for (i = 0, l=linear.trackingEvents.midpoint.length; i < l; i++) {
							$NS$.track.pixel(linear.trackingEvents.midpoint[i]);
						}
						done.mid = true;
					}
				}
				if (!done.third && current_time >= Math.floor(3*linear.duration/4)) {
					if (linear.trackingEvents.thirdQuartile != null && linear.trackingEvents.thirdQuartile.length) {
						//loop the queue
						for (i = 0, l=linear.trackingEvents.thirdQuartile.length; i < l; i++) {
							$NS$.track.pixel(linear.trackingEvents.thirdQuartile[i]);
						}
						done.third = true;
					}
				}
				if (!done.end && current_time >= (linear.duration - 2)) { // almost End (2 sec tolerance)
					if (linear.trackingEvents.complete != null && linear.trackingEvents.complete.length) {
						//loop the queue
						for (i = 0, l=linear.trackingEvents.complete.length; i < l; i++) {
							$NS$.track.pixel(linear.trackingEvents.complete[i]);
						}
						done.end = true;
					}
					
					videoPlayer.removeEventListener('timeupdate', _timeupdate);
				}


			},

			alerted = false,

			// all that once
			// 
			impressions = false,
			
			fadeVolume = function (versus) {

				setTimeout(function () {
					videoPlayer[versus > 0 ? 'unmute' : 'mute']();
				}, versus > 0 ? 0 : 1000);

				var vol = videoPlayer.volume,
					incr = 0.1,
					freq = 10,
					f = function () {
						setTimeout(function () {
							vol += versus * incr;

							if (vol > 1) {
								videoPlayer.volume = 1;
								return;
							}
							if (vol < 0) {
								videoPlayer.volume = 0;
								return;
							}
							
							videoPlayer.volume = vol;
							
							f();
						}, 1000 / freq);
					};
				f();
				
				
				// videoPlayer.volume = versus > 0 ? 1 : 0;
				// videoPlayer[versus > 0 ? 'unmute' : 'mute']();
			},
			tObj = {};
/*
		$NS$.events.on(videoPlayer, 'error', function () {
			if (!alerted) {
				alerted = true;
				alert('Video not yet transcoded, wait a while please.');
			}
			
		});
*/
		// if mobile add the poster 
		// 
		if (isMobile) {
			$NS$.dom.attr(videoPlayer, 'poster', linear.mediaFiles.gifUrl);
		}



		// set the video src
		//
		// videoPlayer.src = linear.mediaFiles.items['media/mp4'];
		// NOOOOOOOOOOOOOOOOOOOOOOOOOO dont do that on the video tag!!!,

		// and sources too
		var c = $NS$.dom.childs(videoPlayer),
			childs = $NS$.util.coll2array(c),
			alertNum = 0;

		for (var i = 0, l = childs.length, t; i < l; i++) {
			
			$NS$.events.on(childs[i], 'error', function () {
				alertNum++;
			});
			t = childs[i].type;



			// in case a type is not defined ...remove it
			//
			if (linear.mediaFiles.items[t]) {
				childs[i].src = linear.mediaFiles.items[t];
			} else {
				videoPlayer.removeChild(childs[i]);
			}



		}
		
		if (alertNum == childs.length) {
			alerted = true;
			alert('Video not yet transcoded, wait a while please.');
		}




		videoPlayer.load();

		tObj['inReadSaysVisible' + '_' + $NS$.aid] = function () {
			videoPlayer._impressions();
		};
		msgReceiver(tObj);

		// add a method to the video tag so that
		// enables quartiles trakings
		// triggers pixels vast impressions
		// and plays the video
		// 

		videoPlayer.enableClickThrough = function () {
			$NS$.log('VAST DEBUG: enabled clickThrough');
			_addClickThrough(videoPlayerID, oVast);
		};
		videoPlayer.removeClickThrough = videoPlayer.disableClickThrough = function () {
			$NS$.log('VAST DEBUG: disabled clickThrough');
			_removeClickThrough(videoPlayerID);
		};
		videoPlayer.enableQuartiles = function () {
			$NS$.log('VAST DEBUG: enabled Quartiles');
			// quartiles on
			videoPlayer.addEventListener('timeupdate', _timeupdate);
		};
		videoPlayer.disableQuartiles = function () {
			$NS$.log('VAST DEBUG: disabled Quartiles');
			// quartiles off
			videoPlayer.removeEventListener('timeupdate', _timeupdate);
		};
		videoPlayer._impressions = function () {
			//
			// big attention to trigger that only once
			//
			if (!impressions) {
				$NS$.log('VAST DEBUG: doing impressions');
				if ($NS$.util.isArray(oVast.impressions)) {
					for (var i = 0, l=oVast.impressions.length; i < l; i++) {
						$NS$.track.pixel(oVast.impressions[i]);
					}
				} else {
					$NS$.track.pixel(oVast.impressions);
				}
				impressions = true;
			}
		};

		/**
		 * event handshake check for triggering impressions
		 */
		videoPlayer.impressions = function () {
			
			// book a delayed call to the parent window...
			//
			window.setTimeout(function () {

				// ... where we ask for the inRead status
				// this will lead the inread to answer with a hubmessage
				// like
				// `inReadSaysVisible` if visible
				// or
				// `inReadSaysInvisible` if...guess what...!
				// 
				msgSender('getInreadStatus' + '_' + $NS$.aid);
			}, impressionsDelay);

		};
		
		videoPlayer.vplay = function () {
			$NS$.log('VAST DEBUG: play');
			videoPlayer.play();
		};
		
		videoPlayer.vpause = function () {
			$NS$.log('VAST DEBUG: pause');
			videoPlayer.pause();
		};
		
		videoPlayer.volumeUp = function () {
			$NS$.log('VAST DEBUG: volumeUp');
			fadeVolume(1);
		};
		
		videoPlayer.volumeDown = function () {
			$NS$.log('VAST DEBUG: volumeDown');
			fadeVolume(-1);
		};
		
		videoPlayer.enableLoop = function () {
			$NS$.log('VAST DEBUG: enabled loop');
			$NS$.dom.attr(videoPlayer, 'loop', 'true');
		};

		videoPlayer.disableLoop = function () {
			$NS$.log('VAST DEBUG: disabled loop');
			$NS$.dom.removeAttr(videoPlayer, 'loop');
		};

		videoPlayer.playMutedImpressions = function () {
			videoPlayer.mute();
			videoPlayer.impressions();
			videoPlayer.vplay();
		};

		videoPlayer.mute = function () {
			$NS$.log('VAST DEBUG: mute');
			$NS$.dom.attr(videoPlayer, 'muted', 'muted');
			//videoPlayer.volume = 0;
			videoPlayer.muted = true;
			linear.trackingEvents.mute != null && $NS$.track.pixel(linear.trackingEvents.mute);
		};

		videoPlayer.unmute = function () {
			$NS$.log('VAST DEBUG: unmute');
			$NS$.dom.removeAttr(videoPlayer, 'muted');
			//videoPlayer.volume = 1;
			videoPlayer.muted = false;
			linear.trackingEvents.unmute != null && $NS$.track.pixel(linear.trackingEvents.unmute);
		};

		videoPlayer.addClickThroughOn =
		videoPlayer.enableClickThroughOn = function (domNode, func) {

			$NS$.log('VAST DEBUG: enabled clickThrough');
			_addClickThrough(domNode, oVast, func);
		};

		videoPlayer.removeClickThroughOn =
		videoPlayer.disableClickThroughOn = function (domNode) {
			$NS$.log('VAST DEBUG: disabled clickThrough');
			_removeClickThrough(domNode);
		};


		
		
		progress && videoPlayer.addEventListener('timeupdate', function () {
			var current_time = Math.floor(videoPlayer.currentTime);

			$NS$.Channel.get(options.ChannelID).pub('video_progress', [~~(100 * (current_time/linear.duration))]);
		});


		window.setTimeout(function () {
			playHasDone.done();
		},10);
		return playHasDone;
	};
	
	// Add Clickthrough
	// 
	function _addClickThrough (videoPlayerID, oVast, func) {
		
		
		if (clickTroughActive) return;

		clickTroughActive = true;

		var videoPlayer = $NS$.dom.isElement(videoPlayerID) ? videoPlayerID : document.getElementById(videoPlayerID);

		linear = oVast.linears[0];

		if (!('videoClicks' in linear)
			|| !('clickThrough' in linear.videoClicks)
			|| !linear.videoClicks.clickThrough
		)
		return;
		

		// on click open clickThrough and maybe trigger clickTracking request
		// 
		doClickThrough = function (e) {

			// just to disable it on preview mode
			if (videoPlayer.hasAttribute('stealth')) {
				return;
			}
			func && func();

			window.open(linear.videoClicks.clickThrough).focus();
			
			$NS$.events.kill(e);


			//
			//
			// THIS WILL BE AN ARRAY
			//
			//
			if (linear.videoClicks.clickTracking) {
				if ($NS$.util.isArray(linear.videoClicks.clickTracking)) {
					for(var i = 0, l = linear.videoClicks.clickTracking.length; i < l; i++) {
						$NS$.track.pixel(linear.videoClicks.clickTracking[i]);
					}
				} else {
					$NS$.track.pixel(linear.videoClicks.clickTracking);
				}
				$NS$.log('clickTracking: ' + linear.videoClicks.clickTracking);
			}
			
			

			linear.videoClicks.clickThrough
			&& $NS$.track.debug({type:"clickThrough", url : linear.videoClicks.clickThrough})
			&& $NS$.track.clickThrough({url : linear.videoClicks.clickThrough});
		};
		
		$NS$.events.on(videoPlayer, 'click', doClickThrough);
		videoPlayer.doClickThrough = doClickThrough;
	}
	
	//Remove Clickthrough
	function _removeClickThrough (videoPlayerID) {
		clickTroughActive = false;
		var videoPlayer = $NS$.dom.isElement(videoPlayerID) ? videoPlayerID : document.getElementById(videoPlayerID);
		doClickThrough && $NS$.events.off(videoPlayer, 'click', doClickThrough);
	}
	
	


	return {
		start : initVast,
		straight : straightVast
	};




	
})(); 