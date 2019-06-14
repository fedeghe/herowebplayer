/**
 * Promise library: no makeNS available, cause included even on pusher & dealerr
 */

window.$NS$ = typeof $NS$ !== 'undefined' ? $NS$ : {};

if (!('MsgHub' in window.$NS$)){
	(function () {
		

		var killed = {};

		window.$NS$.MsgHub = {

			kill : function (id) {
				killed[id] = true;
			},

			receiver : function (trgWin) {
				return function (o) {

					var	eventMethod = trgWin.addEventListener ? "addEventListener" : "attachEvent",
						eventer = trgWin[eventMethod],
						messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
					for (var evLabel in o) {
						//
						//-------------------------
						(function (obj, funcName) {
							eventer(messageEvent, function(e) {

								var maybekilled = funcName.match(/($NS$_\d*)/);
								if (maybekilled[0] in killed) return;

								if (e.data && e.data.action && (e.data.action) == funcName){
									console.log('RECEIVED : ' + funcName + ' by: ');
									console.log(trgWin.location);
									obj[funcName]();
								}

							}, false);
						})(o, evLabel);
						//-------------
						//
					}
				}
			},
			sender : function (trgWin) {
				return function () {

					var a = [].slice.call(arguments, 0),
						l = a.length,
						i = 0,
						maybekilled;
					
					for (null; i < l; i++) {
						
						var maybekilled = a[i].match(/($NS$_\d*)/);
						if (maybekilled[0] in killed) return;

						console.log('SENDED : ' + a[i] + ' from: ');
						console.log(trgWin.location);
						trgWin.postMessage({action : a[i]}, '*');
						
					}
				};
			}
		};
	})();
}