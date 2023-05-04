(function () {

	$$timelapse/EventClock.js$$

	$$timelapse/TimeLapse.js$$

	$NS$.timelapse = {
		/**
		 * { function_description }
		 *
		 * @param      {<type>}  target     The target
		 * @param      {<type>}  ep_or_fun  entry point or function
		 * @param      {<type>}  width      The width
		 * @param      {<type>}  height     The height
		 */
		start : function (target, ep_or_fun, width, height){
			new Timelapse(target, ep_or_fun, width, height).init();	
		}
	};
})();
