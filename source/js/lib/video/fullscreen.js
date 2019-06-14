var fullscreen = {
	toggle : function (video) {
		var status = fullscreen.status();
		
		if (status) {
			if (video.exitFullscreen) {
				video.exitFullscreen();
			} else if (video.mozCancelFullScreen) {
				video.mozCancelFullScreen();
			} else if (video.webkitExitFullscreen) {
				video.webkitExitFullscreen();
			}
		} else {
			if (video.requestFullscreen) {
				video.requestFullscreen();
			} else if (video.mozRequestFullScreen) {
				video.mozRequestFullScreen();
			} else if (video.webkitRequestFullscreen) {
				video.webkitRequestFullscreen();
			} else if (video.msRequestFullscreen) {
				video.msRequestFullscreen();
			}
		}
		return !status;
	},

	status : function (v) {
		v = v || document;
		return !!(v.fullscreen ||
			v.mozFullScreen ||
			v.webkitFullscreen ||
			v.webkitIsFullscreen);
	},

	available : function (v) {
		v = v || document;
		return !!(v.fullscreenEnabled ||
			v.mozFullScreenEnabled ||
			v.webkitFullscreenEnabled);
	}
}

