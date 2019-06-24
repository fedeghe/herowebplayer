var PLAYER = {
    style: {
        position: "relative",
        backgroundColor: 'black',
        overflow: 'hidden'
        // ,display : 'none'
    },
    data: {
        id: $NS$.util.uniqueid + "",
        width: "#PARAM{width}",
        height: "#PARAM{height}",
        ratio: "#PARAM{ratio}",
        lang: "#PARAM{lang|en}",
        vast: "#PARAM{vast}",
        vastObj: null
    },
    init: function () {
        var self = this,
            $elf = self.node,
            w = self.data.width,
            h = self.data.height,
            ratio = self.data.ratio || 16 / 9;

        w = w || h * ratio;
        h = h || w / ratio;

        // this breaks somehow chrome poster attr
        // $elf.innerHTML = '<div style="color:white;margin-top:'+(h/2)+'px;width:100%;text-align:center"><b class="fa fa-spinner fa-spin fa-3x fa-fw"></b></div>';

        $elf.style.width = w + 'px';
        $elf.style.height = h + 'px';
        self.data.width = w;
        self.data.height = h;
        self.data.video = $elf;

        if (self.data.vast) {
            $NS$.vast.parse(self.data.vast).then(function (p, res) {
                self.data.vastObj = res[0];
                console.log("VAST to be used");
                console.log(self.data.vastObj);
            });
        }
        $NS$.css.fontAwesome();
        $NS$.dom.headScript({ src: '$ADBLOCKER_CHECK$' });

        return true;
    },
    end: function () {
        var self = this,
            $elf = self.node,
            video = self.getNode('mainvideo'),
            show = function () {
                var $panel = self.getNode('panel').node;
                $NS$.dom.addClass($panel, 'visible');
                video.data.trigger('onshowpanel');
                $elf.style.cursor = 'default';
            },
            hide = function () {
                var $panel = self.getNode('panel').node;
                $NS$.dom.removeClass($panel, 'visible');
                video.data.trigger('onhidepanel');
                $elf.style.cursor = 'none';
            };

        $NS$.events.on($elf, 'mouseenter', show);
        $NS$.events.on($elf, 'mousemove', show);
        $NS$.events.on($elf, 'click', show);
        $NS$.events.on($elf, 'mouseleave', hide);
        $NS$.events.onNoEvent($elf, hide, 5000);
    },

    cb: function () {
        var self = this;
        $NS$.io.getJson('$LANGS_URI$/' + self.data.lang + '.json', function (lang) {
            $NS$.i18n.load(lang);
            self.done();
        }, {}, false, true)
    },

    content: [{
        wid: 'midCommand',
        attrs: {
            "class": "midcommand play fa fa-play visible"
        },
        data: {
            size: "#PARAM{buttons.size|small}"
        },
        cb: function () {
            var self = this,
                $elf = self.node;
            $elf.classList.add(self.data.size)
            $NS$.events.on($elf, 'click', function () {
                $elf.classList.remove('visible');
                self.getNode('mainvideo').node.playpause();
            });
            self.done();
        }
    }, {
        tag: "video",
        wid: "mainvideo",
        text: "#PARAM{supportMessage|video not supported}",
        data: {
            speed: 1,
            uri: "#PARAM{sources.mp4}",
            attrs: {
                poster: "#PARAM{sources.poster}",
                preload: "#PARAM{preload}",
                loop: "#PARAM{loop}",
                autoplay: "#PARAM{autoplay}",
                muted: "#PARAM{muted}"
            },
            events: "#PARAM{events}",
            duration: 0,
            timelapse: "#PARAM{timelapse}",
            tracks: "#PARAM{sources/tracks}",
            offset: "#PARAM{offset}",

            trigger: function (eventName, args) {
                if (eventName in this.events) {
                    this.events[eventName].apply(this.video, args);
                    return true;
                }
                return false;
            }
        },
        style: {
            width: "inherit",
            height: "inherit",
            position: "absolute",
            left: "0px",
            top: "0px",
            zIndex: 100
        },
        content: [{
            tag: 'source',
            data: { src: "#PARAM{sources.webm}" },
            attrs: { type: "video/webm" },
            cb: function () {
                var self = this,
                    $elf = self.node;
                if (!self.data.src) {
                    $NS$.dom.remove($elf)
                } else {
                    $NS$.dom.attr($elf, 'src', self.data.src)
                }
                self.done();
            }
        }, {
            tag: 'source',
            data: { src: "#PARAM{sources.mp4}" },
            attrs: { type: "video/mp4" },
            cb: function () {
                var self = this,
                    $elf = self.node;
                if (!self.data.src) {
                    $NS$.dom.remove($elf)
                } else {
                    $NS$.dom.attr($elf, 'src', self.data.src)
                }
                self.done();
            }
        }, {
            tag: 'source',
            data: { src: "#PARAM{sources.ogg}" },
            attrs: { type: "video/ogg" },
            cb: function () {
                var self = this,
                    $elf = self.node;
                if (!self.data.src) {
                    $NS$.dom.remove($elf)
                } else {
                    $NS$.dom.attr($elf, 'src', self.data.src)
                }
                self.done();
            }
        }],
        init: function () {

            console.log("===============")
            console.log("params")
            console.log(this.data)

            this.data.video = this.node;
            this.data.events = this.data.events || {};

            return true;
        },
        cb: function () {
            var self = this,
                $elf = self.node,
                data = self.data,
                $parent = self.parent.node,
                // tracks = { target: $elf, content: [] },
                i, l, tmp = {};

            data.isPlaying = false;
            data.isFullscreen = false;

            if (self.data.tracks) {
                for (i = 0, l = self.data.tracks.length; i < l; i++) {
                    (function (trk) {
                        var obj = {
                            target: $elf,
                            tag: 'track',
                            attrs: {},
                            style: {}
                        };
                        'default' in trk && (obj.attrs.default = trk.default);
                        'src' in trk && (obj.attrs.src = trk.src);
                        'kind' in trk && (obj.attrs.kind = trk.kind);
                        'srclang' in trk && (obj.attrs.srclang = trk.srclang);
                        'label' in trk && (obj.attrs.label = trk.label);

                        obj.style.backgroundColor = 'red';

                        $NS$.Widgzard.render(obj);
                    })(self.data.tracks[i]);
                }
            }

            data.attrs.poster
            && $NS$.dom.attr($elf, { poster: data.attrs.poster });
            
            data.attrs.preload
            && $NS$.dom.attr($elf, { preload: data.attrs.preload }); // auto, metadata, none
            
            data.attrs.loop
            && $NS$.dom.attr($elf, { loop: 'loop' });

            data.attrs.autoplay
            && $NS$.dom.attr($elf, { autoplay: 'autoplay' });

            if (data.attrs.muted) {
                $NS$.dom.attr($elf, { muted: 'muted' });
                $elf.volume = 0;
            }

            $NS$.events.on($elf, 'loadeddata', function (e) {
                data.trigger('onloadeddata', [e]);
                // $NS$.css.style($parent, 'display', 'block');
            });

            $NS$.events.on($elf, 'loadedmetadata', function (e) {
                data.trigger('onloadedmetadata', [e]);
                data.duration = $elf.duration;
                if (self.data.offset) {
                    $elf.currentTime = self.data.offset;
                }
            });

            $NS$.events.on($elf, 'ended', function (e) {
                data.trigger('onended', [e]);
                if (self.data.offset) {
                    $elf.currentTime = self.data.offset;
                    $NS$.events.one($elf, 'play', function (e) {
                        if (self.data.offset) $elf.currentTime = 0;
                    })
                } else {
                    $elf.currentTime = 0;
                }
                // $elf.load();
                if (data.attrs.loop) {
                    $elf.play();
                }
            });
			/*
			// DONE IN THE PANEL component
			$NS$.events.on($elf, 'timeupdate', function () {
				data.trigger('ontimeupdate', [$elf.currentTime]);
			});
			*/
            $NS$.events.on($elf, 'click', function (e) {
                var fs_status = $NS$.video.fullscreen.status();
                if (!fs_status) {
                    data.trigger('onclickthrough', [e])
                        ||
                        $elf.playpause();
                }
            });

            $NS$.events.one($elf, 'play', function (e) {
                if (self.data.offset) $elf.currentTime = 0;
            });

            $NS$.events.on($elf, 'play', function (e) {
                var $playButton = self.getNode('panelPlayButton').node;
                if ($elf.currentTime < 1) {
                    self.data.trigger('onstarted', [e]);
                }
                self.getNode('midCommand').node.classList.remove('visible');
                self.data.isPlaying = true;
                self.data.trigger('onplay', [e]);
            });

            $NS$.events.on($elf, 'pause', function (e) {
                var perc = parseFloat((100 * $elf.currentTime / $elf.duration).toFixed(2), 10),
                    cTime = parseFloat($elf.currentTime.toFixed(2), 10);
                self.data.isPlaying = false;
                self.data.trigger('onpause', [e, cTime, perc]);
            });

            $NS$.events.on(document, ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'MSFullscreenChange'], function (e) {
                //var status = $NS$.video.fullscreen.status();
                data.isFullscreen = !data.isFullscreen;
                // if (status) {
                if (data.isFullscreen) {
                    $NS$.dom.attr($elf, 'controls', 'controls');
                    data.trigger('onfullscreenon', [e]);
                } else {
                    $NS$.dom.removeAttr($elf, 'controls');
                    data.trigger('onfullscreenoff', [e]);
                }
            });

            self.done();
        },
        end: function () {
            var self = this,
                $elf = self.node,
                data = self.data,
                parent = self.parent,
                $parent = parent.node,
                autoplay = data.attrs.autoplay;

            //API
            $elf.playpause = function () {
                $elf[autoplay ? 'pause' : 'play']();
                autoplay = !autoplay;
            };

            $NS$.events.ready(function () {
                window.setTimeout(function () {
                    if ('onadblocker' in data.events && !('adblocked' in window)) {
                        data.events.onadblocker();
                    }
                }, 1000);
            });

            ('onvisible' in data.events || 'oninvisible' in data.events || 'onvisibilitychange' in data.events)
                &&
                $NS$.livebox({
                    target: $parent,
                    whenVisible: function () {
                        data.trigger('onvisible', arguments)
                        $elf.visible = true;
                    },
                    whenInvisible: function () {
                        data.trigger('oninvisible', arguments)
                        $elf.visible = false;
                    },
                    whenChange: function () {

                        data.trigger('onvisibilitychange', arguments)
                    },
                    once: false,
                    width: parent.data.width,
                    height: parent.data.height
                });

            data.timelapse
                &&
                $NS$.timelapse.start(
                    $elf,
                    data.timelapse,
                    parseInt($parent.style.width, 10),
                    parseInt($parent.style.height, 10)
                );
        }
    }, {
        component: 'filters'
    }, {
        component: 'panel',
        params: {
            config: {
                theme: '#PARAM{theme||null}'
            },
            sources: {
                webm: "#PARAM{sources.webm}",
                mp4: "#PARAM{sources.mp4}",
                ogg: "#PARAM{sources.ogg}"
            },
            screenshot: "#PARAM{panel.screenshot}",
            timeline: "#PARAM{panel.timeline}",
            settings: "#PARAM{panel.settings}",
            fullscreen: "#PARAM{panel.fullscreen}",
            visible: "#PARAM{panel.visible}",
            width: "#PARAM{width}",
            ratio: "#PARAM{ratio}",
            volume: "#PARAM{volume}",
            muted: "#PARAM{muted}"
        }
    }, {
        // this is a preview canvas for the screenshot
        tag: 'canvas',
        data: {
            width: "#PARAM{width}",
            ratio: "#PARAM{ratio}"
        },
        wid: 'cnvs',
        style: { display: 'none' },
        cb: function () {

            var self = this,
                $elf = self.node;
            $elf.width = self.data.width;
            $elf.height = self.data.width / (self.data.ratio);
            self.done();
        }
    }]
}
