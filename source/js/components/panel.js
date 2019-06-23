var PANEL = {
    wid: 'panel',
    attrs: {
        "class": "panel"
    },
    style: {
        zIndex: 300
    },
    data: {
        config: "#PARAM{config}",
        timeline: "#PARAM{timeline}",
        visible: "#PARAM{visible}"
    },
    content: [{
        tag: 'div',
        attrs: { "class": "preview" },

        // wid : 'preview',
        content: [{
            tag: 'div',
            attrs: { "class": "arrow" }
        }, {
            tag: 'div',
            attrs: { "class": "previewtime" },
            content: [{ tag: 'span' }]
        }, {
            tag: 'video',
            // style:{top:0},
            attrs: {
                preload: 'auto'
            },
            content: [{
                tag: 'source',
                attrs: {
                    type: "video/webm",
                    src: "#PARAM{sources.webm}"
                }
            }, {
                tag: 'source',
                attrs: {
                    type: "video/mp4",
                    src: "#PARAM{sources.mp4}"
                }
            }, {
                tag: 'source',
                attrs: {
                    type: "video/ogg",
                    src: "#PARAM{sources.ogg}"
                }
            }]
        }],
        end: function () {

            var self = this,
                $elf = self.node,
                mainVideo = self.getNode('mainvideo'),
                $mainVideo = mainVideo.node,
                video = self.children[2],
                panel = self.parent,
                $video = video.node;

            self.data.showPreviewAt = function (p, e) {
                var duration = $video.duration,
                    t = duration * (p / 100),
                    time = self.descendant(1, 0);

                time.node.innerHTML = $NS$.util.formatMs(t);

                t = parseFloat(t.toFixed(2), 10);

                // e && 'onpreview' in mainVideo.data.events && mainVideo.data.events.onpreview(e, t, parseFloat(p.toFixed(2), 10));
                e && mainVideo.data.trigger('onpreview', [
                    e,
                    t,
                    parseFloat(p.toFixed(2), 10)
                ]);
                $video.currentTime = t;
                //then the canPlay will be triggered at some point allowing the handler to paint the preview frame
            };
        }

    }, {
		/**
		 * TIMELINE
		 * @type {Object}
		 */
        style: {
            position: 'relative'
        },
        attrs: { "class": "timeline default" },
        data: {
            timeline: "#PARAM{timeline}"
        },
        content: [{
            tag: 'div',
            attrs: { "class": "loaded" },
            cb: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo'),
                    $video = video.node;
                $NS$.video.loader(video, $video, function (v) {
                    $NS$.css.style($elf, 'width', v + '%');
                }, function (v) {
                    console.debug('end ' + v);
                });
                self.done();
            }
        }, {
            tag: 'div',
            attrs: { "class": "request" }
        }, {
            tag: 'div',
            attrs: { "class": "played #PARAM{timeline.playcolor|red}" },
            cb: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo'),
                    $video = video.node;

                $NS$.events.on($video, 'timeupdate', function (e) {
                    var time = $video.currentTime,
                        duration = $video.duration,
                        perc = ~~(100 * time / duration);
                    $NS$.css.style($elf, 'width', ~~(100 * time / duration) + '%')

                    video.data.trigger('ontimeupdate', [
                        e,
                        parseFloat(time.toFixed(2), 10),
                        duration,
                        perc
                    ]);
                });

                self.done();
            }
        }],
        cb: function () {
            var self = this,
                $elf = self.node,
                data = self.data,
                video = self.getNode('mainvideo'),
                $video = video.node,
                preview;

            data.video = $video;

            $NS$.events.on($elf, 'click', function (e) {
                preview = preview || self.parent.children[0];
                var w = $elf.clientWidth,
                    coordX = $NS$.events.getOffset(e, $elf)[0],
                    position = coordX;

                if (position < 0) position = 0;
                if (position > w) position = w - preview.node.clientWidth;
                data.video.currentTime = data.video.duration * (coordX / w);

                video.data.trigger('onseek', [
                    e,
                    parseFloat(data.video.currentTime.toFixed(2), 10),
                    parseFloat((100 * data.video.currentTime / data.video.duration).toFixed(2), 10)
                ]);
            });

            if (data.timeline.preview == false) {
                self.done();
                return;
            }

            $NS$.events.on($elf, 'mouseenter', function (e) {
                preview = preview || self.parent.children[0];
                $NS$.css.style(preview.node, 'display', 'block');
            });

            $NS$.events.on($elf, 'mouseleave', function (e) {
                preview = preview || self.parent.children[0];
                $NS$.css.style(preview.node, 'display', 'none');
            });

            $NS$.events.on($elf, 'mousemove', function (e) {
                preview = preview || self.parent.children[0];
                var w = $elf.clientWidth,
                    coordX = $NS$.events.getOffset(e, $elf)[0],
                    position = coordX - preview.node.clientWidth / 2;

                if (position < 0) position = 0;
                if (position + preview.node.clientWidth > w) position = w - preview.node.clientWidth;

                $NS$.css.style(preview.node, { left: position + 'px' });
                preview.data.showPreviewAt(100 * coordX / w, e);
            });

            data.addAdMarker = function (start, len) {
                $NS$.Widgzard.render({
                    target: $elf,
                    attrs: { "class": "ad" },
                    style: { left: start + "%", width: len + '%' }
                })
            }
            self.done();
        },
        end: function () {
            // this.data.addAdMarker(3,0.3);
            // this.data.addAdMarker(20,15);
            // this.data.addAdMarker(50,0.5);
        }
    }, {
        attrs: { "class": "actions group" },
        content: [{
            tag: 'span',
            wid: "panelPlayButton",
            attrs: { "class": "play-button button floatl" },
            content: [{ tag: 'span', attrs: { "class": "fa fa-play" } }],
            cb: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo'),
                    vdata = video.data,
                    $video = video.node;

                $NS$.events.on($elf, 'click', function (e) {
                    $video[vdata.isPlaying ? 'pause' : 'play'].call($video, e);
                });

                $NS$.events.on($video, ['play', 'pause'], function () {
                    var versus = ['fa-play', 'fa-pause'];
                    if (!vdata.isPlaying) versus = versus.reverse();
                    $NS$.dom.switchClass.apply(null, [self.children[0].node].concat(versus));
                    $NS$.dom.attr($elf, {
                        title: vdata.isPlaying ? $NS$.i18n.get('pause') : $NS$.i18n.get('play')
                    });
                });

                // $NS$.events.on($video, 'pause', function() {
                // 	$NS$.dom.switchClass(self.children[0].node, 'fa-pause', 'fa-play');
                // });

                self.done();
            },
            end: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo'),
                    $video = video.node;
                $NS$.dom.attr($elf, {
                    title:
                        video.data.isPlaying ? $NS$.i18n.get('pause') : $NS$.i18n.get('play')
                });
            }
        }, {
            tag: 'span',
            attrs: { "class": "volume-button button floatl" },
            content: [{
                tag: 'span',
                attrs: { "class": "fa fa-volume-off" },
                wid: 'volumebutton'
            }],
            data: {
                muted: "#PARAM{muted}"
            },
            cb: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo'),
                    $video = video.node;

                $NS$.events.on($elf, 'click', function (e) {
                    var vol = $video.volume,
                        volumeinput = self.getNode('volumeinput'),
                        $volumeinput = volumeinput.node,
                        muted = vol == 0;

                    $video.volume = muted ? parseFloat($volumeinput.value, 10) : 0;

                    if (muted) {
                        $video.volume = volumeinput.data.vol;
                        $video.muted = false;
                        $video.removeAttribute('muted');
                        $volumeinput.value = volumeinput.data.vol;
                        $NS$.dom.switchClass(self.children[0].node, 'fa-volume-off', 'fa-volume-up');
                        $NS$.dom.attr($elf, { title: $NS$.i18n.get('mute') });
                        video.data.trigger('onunmute', [e]);
                    } else {
                        $volumeinput.value = 0;
                        $NS$.dom.switchClass(self.children[0].node, 'fa-volume-up', 'fa-volume-off');
                        $NS$.dom.attr($elf, { title: $NS$.i18n.get('unmute') });
                        video.data.trigger('onmute', [e]);
                    }
                });
                self.done();
            },
            end: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo'),
                    $video = video.node;
                if ($video.volume > 0) {
                    $NS$.dom.switchClass(self.children[0].node, 'fa-volume-off', 'fa-volume-up');
                }
                $NS$.dom.attr($elf, { title: $video.volume ? $NS$.i18n.get('mute') : $NS$.i18n.get('unmute') });
            }
        }, {
            tag: 'span',
            attrs: { "class": "volume-range range floatl" },
            wid: 'range',
            content: [{
                tag: 'input',
                wid: 'volumeinput',
                data: {
                    muted: "#PARAM{muted}"
                },
                attrs: {
                    "type": "range",
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: "#PARAM{volume|0.8}"
                },
                cb: function () {
                    var self = this,
                        $elf = self.node,
                        video = self.getNode('mainvideo'),
                        $video = video.node,
                        oldVol;
                    // debugger;
                    self.data.vol = parseFloat($elf.value, 10);
                    $video.volume = self.data.vol;
                    oldVol = $video.volume;

                    if (self.data.muted) {
                        $video.volume = 0;
                        $elf.value = 0;
                    }

                    $NS$.events.on($elf, 'input', function (e) {
                        var volbutt = self.getNode('volumebutton').node;
                        $video.volume = $elf.value;
                        self.data.vol = $elf.value;

                        if ($elf.value == oldVol) { return; }
                        oldVol = $elf.value;

                        // 'onvolumechange' in video.data.events && video.data.events.onvolumechange(e, $video);
                        video.data.trigger('onvolumechange', [e]);
                        if ($video.volume == 0) {
                            $NS$.dom.switchClass(volbutt, 'fa-volume-up', 'fa-volume-off');
                        } else {
                            $NS$.dom.switchClass(volbutt, 'fa-volume-off', 'fa-volume-up');
                            $video.muted = false;
                            $video.removeAttribute('muted');
                        }
                    });
                    self.done();
                }
            }],
        }, {
            tag: 'span',
            attrs: { "class": "time" },
            cb: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo'),
                    $video = video.node;

                $NS$.events.on($video, 'timeupdate', function (e) {
                    $elf.innerHTML = $NS$.util.formatMs($video.currentTime) + '/' + $NS$.util.formatMs($video.duration);
                });

                $NS$.events.on($video, 'loadeddata', function () {
                    $elf.innerHTML = $NS$.util.formatMs($video.currentTime) + '/' + $NS$.util.formatMs($video.duration);
                });

                self.done();
            }
        }, {
            tag: 'span',
            attrs: { "class": "fullscreen-button button floatr" },
            content: [{ tag: 'span', attrs: { "class": "fa fa-expand" } }],
            data: {
                show: "#PARAM{fullscreen}"
            },
            cb: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo'),
                    $video = video.node;

                if (!self.data.show) {
                    $NS$.dom.remove($elf);
                    self.done();
                    return;
                }

                $NS$.events.on($elf, 'click', function (e) {
                    $NS$.video.fullscreen.toggle($video);
                });

                if (!$NS$.video.fullscreen.available()) {
                    $NS$.dom.remove($elf);
                }
                self.done();
            },
            end: function () {
                var self = this,
                    $elf = self.node;
                $NS$.dom.attr($elf, { title: $NS$.i18n.get('fullscreen') });
            }
        }, {
            tag: 'span',
            attrs: { "class": "settings-button button floatr" },
            content: [{ tag: 'span', attrs: { "class": "fa fa-gear" } }],
            data: {
                show: "#PARAM{settings.visible}"
            },
            cb: function () {
                var self = this,
                    $elf = self.node,
                    video = self.getNode('mainvideo');

                if (!self.data.show) {
                    $NS$.dom.remove($elf);
                    self.done();
                    return;
                }
                $NS$.events.on($elf, 'click', function (e) {
                    var settings = self.getNode('settings'),
                        $settings = settings.node;
                    if (settings.data.visible) {
                        $NS$.css.style($settings, 'display', 'none');
                    } else {
                        $NS$.css.style($settings, 'display', 'block');
                    }
                    settings.data.visible = !settings.data.visible;
                    video.data.trigger('onsettings' + (settings.data.visible ? 'on' : 'off'), [e]);
                })
                self.done();
            },
            end: function () {
                var self = this,
                    $elf = self.node;
                $NS$.dom.attr($elf, { title: $NS$.i18n.get('settings') });
            }
        }, {
            tag: 'span',
            attrs: { "class": "screenshot-button button floatr" },
            content: [{ tag: 'span', attrs: { "class": "fa fa-camera" } }],
            data: {
                show: "#PARAM{screenshot}",
                width: "#PARAM{width}",
                ratio: "#PARAM{ratio}"
            },
            cb: function () {
                var self = this,
                    $elf = self.node,
                    root = self.root,
                    video = self.getNode('mainvideo');

                if (!self.data.show) {
                    $NS$.dom.remove($elf);
                    self.done();
                    return;
                }

                $NS$.events.on($elf, 'click', function (e) {
                    var $video = video.node,
                        canvas = self.getNode('cnvs').node,
                        ctx = canvas.getContext('2d'),
                        w = self.data.width,
                        h = self.data.width / (self.data.ratio),
                        img = new Image(),
                        a = document.createElement('a');

                    ctx.drawImage($video, 0, 0, w, h);
                    img.src = canvas.toDataURL("image/png");
                    img.width = w;
                    img.height = h;
                    img.style.width = w + 'px';
                    img.style.height = h + 'px';
                    img.style.display = 'none';

                    a.download = $video.currentTime + "-time.jpg";
                    a.href = canvas.toDataURL("image/png");
                    a.target = '_blank';
                    a.onclick = function () {
                        document.body.removeChild(a);
                    }
                    a.appendChild(img);

                    document.body.appendChild(a);
                    a.click();
                    video.data.trigger('onscreenshot', [e]);
                })
                self.done();
            },
            end: function () {
                var self = this,
                    $elf = self.node;
                $NS$.dom.attr($elf, { title: $NS$.i18n.get('screenshot') });
            }
        }, {
            component: "settings",
            params: "#PARAM{settings}"
        }
            // ,'clearer'
        ]
    }],
    cb: function () {
        var self = this,
            $elf = self.node,
            video = self.parent.children[0].node,//getNode('video').node,
            playing = true;

        $NS$.dom.addClass($elf, self.data.config.theme.background || 'bgWhite');
        $NS$.dom.addClass($elf, self.data.config.theme.foreground || 'fgBlack');
        $NS$.dom.addClass($elf, self.data.timeline.size);
        $NS$.events.on($elf, 'click', function (e) {
            $NS$.events.kill(e);
        });
        if (!self.data.visible) {
            $NS$.dom.remove($elf);
        }
        /*
                $NS$.events.on($elf, 'mouseover', function () {
                    if (playing) {
                        video.pause();
                        playing = false;
                    }
                });
        
                $NS$.events.on($elf, 'mouseleave', function () {
                    if (!playing) {
                        video.play();
                        playing = true;
                    }
                });
        */
        self.done();
    }
}
