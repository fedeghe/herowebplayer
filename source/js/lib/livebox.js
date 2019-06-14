/**
 * InRead library: no makeNS available, cause included even on pusher & dealerr
 */


(function(W) {


	
	var WD = W.document,
		WDB = WD.body,
		_getCurrentScriptParentNode = function(stag) {
			stag = document.getElementsByTagName('script');
			stag = stag[stag.length - 1];
			return stag.parentNode;
		},
		_isFunction = function(f) {
			return typeof f === 'function';
		},
		_isElement = function(o) {
			return (
				typeof HTMLElement === 'object' ?
				o instanceof HTMLElement : //DOM2
				o && typeof o === 'object' &&
				typeof o.nodeType !== undefined && o.nodeType === 1 &&
				typeof o.nodeName === 'string'
			);
		},

		_isMobile = (function() {
	        var ua = navigator.userAgent || navigator.vendor || window.opera;
	        return /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
	        // return !!(typeof window.ontouchstart != "undefined");
	    })();
	    



	function livebox(params) {
		var self = this,
			start = function() {
				self.getViewPortSize();
				self.getNodePosition();
				self.check();
			};
		
		// checked from outside
		// 
		this.active = true;

		/**
		 * [mode description]
		 * @type {[type]}
		 */
		this.mode = null;

		/**
		 * [status description]
		 * @type {[type]}
		 */
		this.status = null;

		/**
		 * [once description]
		 * @type {Boolean}
		 */
		this.once = true;

		/**
		 * [getVisible description]
		 * @return {[type]} [description]
		 */
		this.getVisible = function () {};

		/**
		 * [getInvisible description]
		 * @return {[type]} [description]
		 */
		this.getInvisible = function () {};

		/**
		 * [getChange description]
		 * @return {[type]} [description]
		 */
		this.getChange = function () {};

		/**
		 * [step description]
		 * @return {[type]} [description]
		 */
		this.step = function () {this.done = true;};

		/**
		 * [description]
		 * @param  {[type]} ) {			var      mid [description]
		 * @return {[type]}   [description]
		 */
		this._twostep = (function () {
			var mid = false;
			return function () {
				if (!mid) {mid = true;}
				else {self.done = true;}
			};
		})();

		/**
		 * [top description]
		 * @type {[type]}
		 */
		this.top = null;

		/**
		 * [left description]
		 * @type {[type]}
		 */
		this.left = null;



		this.size =  {
			width : 0,
			height : 0
		};

		/**
		 * [done description]
		 * @type {Boolean}
		 */
		this.done = false;

		/**
		 * [isBody description]
		 * @type {Boolean}
		 */
		this.isBody = false;

		/**
		 * 
		 */
		this.init(params);

		/**
		 * [if description]
		 * @param  {[type]} document.readyState.match(/complete/i) [description]
		 * @return {[type]}                                        [description]
		 */
		if (document.readyState.match(/complete/i)) {
			start();
		} else {
			$NS$.events.on(W, 'load', start);
		}
	}


	/**
	 * [prototype description]
	 * @type {Object}
	 */
	

		/**
		 * [init description]
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
	livebox.prototype.init = function (opts){

		/**
		 * [node description]
		 * @type {String}
		 */
		this.node = 'target' in opts && _isElement(opts.target) ? opts.target : false,

		/**
		 * [getVisible description]
		 * @type {String}
		 */
		this.getVisible = 'whenVisible' in opts && _isFunction(opts.whenVisible) ? opts.whenVisible : false,

		/**
		 * [getInvisible description]
		 * @type {String}
		 */
		this.getInvisible = 'whenInvisible' in opts && _isFunction(opts.whenInvisible) ? opts.whenInvisible : false,

		/**
		 * [getInvisible description]
		 * @type {String}
		 */
		this.getChange = 'whenChange' in opts && _isFunction(opts.whenChange) ? opts.whenChange : false,

		/**
		 * [once description]
		 * @type {String}
		 */
		this.once = 'once' in opts ? !!opts.once : true;


		'width' in opts && (this.size.width = opts.width);
		'height' in opts && (this.size.height = opts.height);

		// explicit
		if (this.node && this.getVisible) {
			this.mode = 'explicit';
			
			if (this.getInvisible) {
				this.step = this._twostep;
			}
		}
		// implicit
		else {
			this.mode = 'implicit';
			this.node = _getCurrentScriptParentNode();
			if (this.getInvisible) {
				this.step = this._twostep;
			}
		}
	};

	livebox.prototype.getNodePosition = function () {
		var position = $NS$.dom.getNodePosition(this.node, this.size.width, this.size.height);
		this.size.width = this.size.width || this.node.clientWidth || 0,
		this.size.height = this.size.height || this.node.clientHeight || 0;
		this.top  = position.top + this.size.height / 2,
		this.left = position.left + this.size.width / 2;
		return position;
	};

	/**
	 * [hide description]
	 * @return {[type]} [description]
	 */
	livebox.prototypehide = function () {
		// meba by default if not visible
		this.node.style.height = "0px";
	};

		/**
		 * [getScrollingPosition description]
		 * @param  {[type]} rel [description]
		 * @return {[type]}     [description]
		 */
	livebox.prototype.getScrollingPosition = function(rel) {
		var el = this.node,
			curleft = 0,
			curtop = 0,
			sT = WD.body.scrollTop + WD.documentElement.scrollTop,
			sL = WD.body.scrollLeft + WD.documentElement.scrollLeft;
		if (el.offsetParent) {
			do {
				curleft += el.offsetLeft;
				curtop += el.offsetTop;
				el = el.offsetParent;
			} while (el);
		}

		return [!!rel ? curleft - sL : curleft, !!rel ? curtop - sT : curtop];
	};

	/**
	 * [getViewPortSize description]
	 * @return {[type]} [description]
	 */
	livebox.prototype.getViewPortSize = function() {

		this.viewport = (function() {
			if (typeof W.innerWidth != 'undefined') {
				return {
					width: W.innerWidth,
					height: W.innerHeight
				};
			} else {
				if (typeof WD.documentElement != 'undefined' && typeof WD.documentElement.clientWidth != 'undefined' && WD.documentElement.clientWidth != 0) {
					return {
						width: WD.documentElement.clientWidth,
						height: WD.documentElement.clientHeight
					};
				} else {
					return {
						width: WD.getElementsByTagName('body')[0].clientWidth,
						height: WD.getElementsByTagName('body')[0].clientHeight
					};
				}
			}
		})();
	};

	/**
	 * called once when the dom is ready
	 */
	livebox.prototype.check = function() {

		this.getNodePosition();
		this.getViewPortSize();

		var self = this,
			viewed = false,
			oldPerc,
			check = function(el, e) {
				
				// if once is set and has already getVisibleed
				// then shut up
				// 
				if (self.once && self.done) return;

				function f_filterResults(n_win, n_docel, n_body) {
					var n_result = n_win ? n_win : 0;
					if (n_docel && (!n_result || (n_result > n_docel))) {
						n_result = n_docel;
					}
					return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
				}
				var newStatus,
					hasChanged,
					tool = {
						scrollLeft: el ? el.scrollLeft : f_filterResults(
							W.pageXOffset ? W.pageXOffset : 0,
							WD.documentElement ? WD.documentElement.scrollLeft : 0,
							WDB ? WDB.scrollLeft : 0
						),
						scrollTop: el ? el.scrollTop :  f_filterResults(
							W.pageYOffset ? W.pageYOffset : 0,
							WD.documentElement ? WD.documentElement.scrollTop : 0,
							WDB ? WDB.scrollTop : 0
						)
					},
					gotTop = (tool.scrollTop <= self.top && self.top <= (tool.scrollTop + self.viewport.height)),
					gotLeft = (tool.scrollLeft <= self.left && self.left <= (tool.scrollLeft + self.viewport.width)),
					verticalTop = self.top - self.size.height / 2,
					verticalBottom = self.top + self.size.height / 2,
					orizontalLeft = self.left - self.size.width / 2,
					orizontalRight = self.left + self.size.width / 2,
					vmaxtop,vminbottom,
					omaxleft,ominright,
					Sv, So, perc;

				// 0%
				// 
				if ((
					orizontalRight < tool.scrollLeft || orizontalLeft > tool.scrollLeft + self.viewport.width
					||
					verticalBottom < tool.scrollTop || verticalTop > tool.scrollTop + self.viewport.height
				)){
					perc = 0;
				} else {
					// SOMETHING IS VISIBLE
					// 
					vmaxtop = verticalTop > tool.scrollTop ? verticalTop : tool.scrollTop;
					vminbottom = verticalBottom < tool.scrollTop + self.viewport.height ? verticalBottom : tool.scrollTop + self.viewport.height;
					omaxleft = orizontalLeft > tool.scrollLeft ? orizontalLeft : tool.scrollLeft;
					ominright = orizontalRight < tool.scrollLeft + self.viewport.width ? orizontalRight : tool.scrollLeft + self.viewport.width;
					Sv = vminbottom - vmaxtop;
					So = ominright - omaxleft;
					perc = parseFloat((100 * (Sv * So) / (self.size.height * self.size.width)).toFixed(2), 10);
				}

				if (e && self.getChange && oldPerc != perc) {
					self.getChange.call(self.node, e, perc);
					oldPerc = perc;
				}
				
				newStatus = gotTop && gotLeft;

				hasChanged = newStatus != self.status;
				
				if (hasChanged) {

					if (newStatus) {
						self.step();
						self.getVisible.call(self.node, newStatus, e, perc);
						viewed = true;

					// if is not in the viewport & the status hasChanged
					// call the getInvisible function
					// 
					} else {
						
						// only if has been visible at least once
						// make it 
						// 
						if (viewed) {
							self.step();
							self.getInvisible.call(self.node, newStatus, e, perc);
						}
					}
				}

				// update the status for next iteration
				// 
				self.status = gotTop && gotLeft;
			},
			trg = W,
			tmp;

		// call it immediately
		//
		tmp = typeof sm_scrollingSelector !== 'undefined' ? find(sm_scrollingSelector) : false;
		
		// and on scroll & resize
		if (tmp && tmp.length > 0) {
			trg =  tmp[0];
			$NS$.events.on(trg, "scroll",  function (e){
				check(trg, e);
			});
			check(trg);
		} else {
			$NS$.events.on(trg, "scroll", function (e){
				check(null, e);
			});
			check(null, {});
		}
		
		/**
		 * 
		 * BUT restrict ON RESIZE cause breaks on viewport switch
		 * 
		 */
		function refresh() {
			self.getNodePosition();
			self.getViewPortSize();
			check(null, {});
		}

		/**
		 * SAME CODE in $NS$.events.onElementHeightChange
		 *
		 * rem: inread is used even in dealer/pusher where no SM is available
		 */
		if (!_isMobile) {
			$NS$.events.on(W, "resize", refresh);
			$NS$.events.onElementSizeChange(document.body, refresh, 'height');
		}
	};

	// publish a protected constructor
	//
	$NS$.livebox = function(params) {
		return new livebox(params);
	};
})(window);
