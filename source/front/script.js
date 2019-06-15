var target = document.getElementById('trg1');

HWP.render({
    target: target,
    settings: {
        lang: 'en',
        width: 640,
        ratio: 16 / 9,
        sources: {
            mp4: 'media/sintel.mp4',
            webm: 'media/sintel.webm',
            ogg: 'media/sintel.ogv',
            poster: 'media/sintel.png',
            tracks: [{
                'default': 'default',
                src: 'media/text-en.vtt', //the url of the track file
                kind: 'subtitles', // choose among [captions, chapters, descriptions, metadata, subtitles]
                srclang: 'en', // language code
                label: '' // just text
            }]
        },
        theme: 'bgOrange fgWhite',
        autoplay: false,
        muted: false,
        loop: false,
        offset: 0,
        preload: 'preload',
        volume: 0.25,
        buttons: {
            size: "large"
        },
        panel: {
            visible: true,
            fullscreen: true,
            settings: {
                visible: true,
                speed: true,
                filters: true
            },
            screenshot: true,
            timeline: {
                size: 'small', // small,medium,large
                preview: true,
                playcolor: 'white'
            }
        },
        // controls ... this is not allowed obviously
        supportMessage: 'Your browser does not support the video tag',
        // timelapse : "img/swipeme0.png?t=%tl_time%&bc=%tl_burstcount%&cb=%tl_cachebuster%",
        timelapse: function (data) { console.log(data); },
        events: {
            onadblocker: function () {
                // alert("PLEASE consider to DISABLE the Ad-blocker");
                document.location.href = 'adblocked.html';
            },
            onstarted: function () {
                console.debug('on started', arguments);
            },
            onended: function () {
                console.debug('on ended', arguments);
            },
            onerror: function () {
                console.debug('on error', arguments);
            },
            onloaded: function () {
                console.debug('on loaded', arguments);
            },
            onloadeddata: function () {
                console.debug('on loadeddata', arguments);
            },
            onloadedmetadata: function () {
                console.debug('on loadedmetadata', arguments);
            },
            onplay: function () {
                console.debug('on play', arguments);
            },
            onpause: function () {
                console.debug('on pause', arguments);
            },
            ontimeupdate: function () {
                console.debug('on timeupdate', arguments);
            },
            onprogress: function () {
                // console.debug('on progress', arguments);
            },
            onfullscreenon: function () {
                console.debug('on fullscreen on', arguments);
            },
            onfullscreenoff: function () {
                console.debug('on fullscreen off', arguments);
            },

            onclickthrough: function () {
                console.debug('on clickthrough', arguments);
                // this.playpause();
            },

            onmute: function () {
                console.debug('on mute', arguments);
            },
            onunmute: function () {
                console.debug('on unmute', arguments);
            },
            onvolumechange: function () {
                console.debug('on volumechange to : ' + this.volume);
            },
            onseek: function () {
                console.debug('on seek', arguments);
            },
            onpreview: function () {
                console.debug('on preview', arguments);
            },
            onvisible: function () {
                // this.play();
                console.debug('on show', arguments);
            },
            oninvisible: function () {
                // this.pause();
                console.debug('on hide ', arguments);
            },
            onvisibilitychange: function (e, perc) {
                console.debug('on visibility changed to : ' + perc);
            },
            onsettingson: function () {
                console.debug('on settings panel opened', arguments);
            },
            onsettingsoff: function () {
                console.debug('on settings panel closed', arguments);
            },
            onshowpanel: function () {
                console.debug('on panel shown', arguments);
            },
            onhidepanel: function () {
                console.debug('on panel hidden', arguments);
            },
            onscreenshot: function() {
                console.debug('on screenshot taken', arguments);
            }

		}
    }
}).then(function (p, res) {
    var player = res[0];
})

