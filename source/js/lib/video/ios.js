/**
 * IOS version
 */
function PreviewInlineVideoIOS (v) {
    
    var sources,
        sources2,
        self = this,
        containerPosition;
    // v.load();

    this.size = {
        height : v.clientHeight,
        width : v.clientWidth
    };
    this.playing = true;
    this.video = v;
    this.video2 = document.createElement('video');
    sources = [].slice.call(this.video.getElementsByTagName('source'), 0);
    sources2 = [
        document.createElement('source'),
        document.createElement('source')
    ];

    this.outerHeight = parseInt(document.body.style.height, 10);
    this.outerWidth = parseInt(document.body.style.width, 10);

    this.muted = false;
    this.audioLoaded = false;
    this.videoLoaded = false;
    this.video2Loaded = false;
    this.readyToPlay = false;
    this.playback = false;

    /**
     * append sources
     */
    this.video2.appendChild(sources2[0]);
    this.video2.appendChild(sources2[1]);
    this.audio = document.createElement('audio');
    this.audio.setAttribute('preload', 'preload');
    this.video.setAttribute('preload', 'preload');
    this.video.setAttribute('muted', 'muted');


    // this.video.id="asdasdas"
    this.cnv = document.createElement('canvas');
    this.cnv.style.width = this.size.width + 'px';
    this.cnv.style.height = this.size.height + 'px';
    this.cnv.style.zIndex = 300;
    this.cnv.style.top = 0;
    this.cnv.style.left = 0;
    this.cnv.style.position = 'absolute';
    this.cnv.setAttribute('width', this.size.width);
    this.cnv.setAttribute('height', this.size.height);
    opaquePreview && (this.cnv.style.webkitFilter = 'brightness(0.5)');

    this.ctx = this.cnv.getContext('2d');

    this.parent = v.parentNode;
    
    this.container = $NS$.dom.wrap(this.video);

    this.container.style.display = 'inline-block';
    this.container.style.width = this.size.width + 'px';
    this.container.style.height = this.size.height + 'px';
    this.container.style.position = 'relative';
    this.container.style.left = 0;
    this.container.style.top = 0;

    //the container must be positioned most likely
    //
    containerPosition = $NS$.util.adaptive.getVideoCoordinates({
        width : this.outerWidth,
        height : this.outerHeight
    });

    this.container.style.left = containerPosition.left + 'px';
    this.container.style.top = containerPosition.top + 'px';

    this.a_mp4 = document.createElement('source');
    this.a_mp4.setAttribute('type', 'audio/mp4');
    this.a_webm = document.createElement('source');
    this.a_webm.setAttribute('type', 'audio/webm');
    
    // sources
    // 
    for (var i = 0, l = sources.length; i < l; i++) {
        switch(sources[i].type) {
            case 'video/mp4' : 
                this.a_mp4.setAttribute('src', sources[i].src);
            break;
            case 'video/webm' : 
                this.a_webm.setAttribute('src', sources[i].src);
            break;
        }
        sources2[i].src = sources[i].src;
        sources2[i].type = sources[i].type;
    }

    this.volumeSwitch = document.createElement('span');
    this.volumeSwitch.className = volumeActive;
    // this.volumeSwitch.style.zIndex = 401;
    // this.volumeSwitch.style.width = this.size.width / 10 + 'px';
    this.volumeSwitch.style.cursor = 'pointer';
    this.volumeSwitch.style.color = 'white';
    // this.volumeSwitch.style.textShadow = '0px 0px 5px #fff';
    this.volumeSwitch.style.display = 'none';

    this.actionButton = document.createElement('span');
    this.actionButton.className = spinnerClass;
    this.actionButton.style.pointerEvents = 'none';
    this.actionButton.style.color = 'white';
    this.actionButton.style.cursor = 'pointer';
    // this.actionButton.style.textShadow = '0px 0px 5px #fff';
    // this.actionButton.style.zIndex = 301;

    this.rushPlay = v.hasAttribute('autoplay');
    
    

    this.video.style.display = "none";
    // this.audio.style.display = "none";


     function setVideo(_v, z) {
        _v.style.position = 'absolute';
        _v.style.left = 0;
        _v.style.top = 0;
        _v.style.width = self.size.width + 'px';
        _v.style.height = self.size.height + 'px';
        _v.style.zIndex = z;
        _v.setAttribute('preload', 'preload');
    }

    setVideo(this.video, 200);
    setVideo(this.video2, 299);

    // append
    this.audio.appendChild(this.a_mp4);
    this.audio.appendChild(this.a_webm);
    this.container.appendChild(this.video2)
    this.container.appendChild(this.audio)
    this.container.parentNode.appendChild(this.volumeSwitch);
    this.container.parentNode.appendChild(this.actionButton);
    this.container.appendChild(this.cnv);
    
    
    this.parent.appendChild(this.container);

    this.ctx.drawImage(v, 0, 0, this.size.width, this.size.height);

    //
    //=====================================================
    //
    (this.video.readyState == 4 && this._videoIsLoaded())
    ||
    this.video.addEventListener(evLoaded, function() {
        self._videoIsLoaded();
    }, false);
    //
    //=====================================================
    //
    (this.video2.readyState == 4 && this._video2IsLoaded())
    ||
    this.video2.addEventListener(evLoaded, function() {
        self._video2IsLoaded();
    }, false);
    //
    //=====================================================
    //
    (this.audio.readyState == 4 && this._audioIsLoaded())
    ||
    this.audio.addEventListener(evLoaded,  function() {
        self._audioIsLoaded();
    }, false);
    //
    //=====================================================
    //

    this.volumeSwitch.addEventListener('click', function () {

        self.volumeSwitch.className = self.muted ? volumeActive : volumeInactive;
        self[self.muted ? 'unmute' : 'mute']();
    });


    this.audio.load();
    this.video.load();
    this.video2.load();
}


PreviewInlineVideoIOS.prototype._audioIsLoaded = function () {
    this.video2.currentTime = 0;
    this.audioLoaded = true;
    this._synchCheck();
    return true;
};

PreviewInlineVideoIOS.prototype._videoIsLoaded = function () {
    this.videoLoaded = true;
    this._synchCheck();
    return true;
};
PreviewInlineVideoIOS.prototype._video2IsLoaded = function () {
    this.video2Loaded = true;
    this._synchCheck();
    return true;
};

PreviewInlineVideoIOS.prototype._synchCheck = function () {
    var self = this;
    
    if (this.videoLoaded && this.video2Loaded && this.audioLoaded) {
        

        //this._readyToPreview();
        try{
            self._readyToPreview();
        } catch (e) {};


        window.addEventListener('message', function(event) {
            if ('message' in event.data && event.data.message == ('touched' + '_' + $NS$.aid)) {

                self._readyToPreview();
            }
            return;
        });

        this.video2.currentTime = 0;
        this.readyToPlay = true;
        return true;
    }
    return false;
};

PreviewInlineVideoIOS.prototype._readyToPreview = function (again) {
    var self = this;
    // this.video2.style.display = 'block';
    this.ctx.drawImage(this.video, 0, 0, this.size.width, this.size.height);
    this.video2.currentTime = 0;
    
    $NS$.dom.attr(this.cnv, 'stealth', 'stealth');

    // this.cnv.addEventListener('click', function () {self._startPlayback();});
    $NS$.events.on(this.cnv, 'click', function () {

        if(!self.playback){
            self._startPlayback();
        }
        self.video.addEventListener('ended', self._ended);
        
    });




    // this._startPreview();
    return true;
};

PreviewInlineVideoIOS.prototype._ended = function () {
    
    var self = this;
    $NS$.dom.attr(self.video, 'stealth', 'stealth');
    self.video.setAttribute('muted', 'muted');  
    $NS$.Channel.get($NS$.aid).pub('undo_skippable');
    


    self.playback = false;
    self.mute();
    self.actionButton.style.display = 'block';
    self.volumeSwitch.style.display = 'none';
    msgSender('collapse' + '_' + $NS$.aid);
};


PreviewInlineVideoIOS.prototype._startPreview = function () {
    this.playback = false;
    this.cnv.style.cursor = 'pointer';
    // this.cnv.className = '';
    opaquePreview && (this.cnv.style.webkitFilter = 'brightness(0.5)');
    
    
    this.actionButton.className = loadedClass;
    

    // remove the video from the dom, but still have it here 
    // this.container.removeChild(this.video);
    // !again && (video.style.visibiliy = 'hidden');
    
    this._doPlay();
};

PreviewInlineVideoIOS.prototype._startPlayback = function () {
    var self = this;
    self.muted = false;
    self.playback = true;
    
    self.actionButton.style.display = 'none';
    
    opaquePreview && (self.cnv.style.webkitFilter = 'brightness(1)');
    

    //volumeswitch
    self.volumeSwitch.style.display = 'block';
    
    self.audio.currentTime = 0;
    self.video.currentTime = 0;
    self.video2.currentTime = 0;

    if (!self.startedAudio) {
        self.startedAudio = true;
        self.audio.play();
    }
    
    $NS$.dom.removeAttr(this.cnv, 'stealth');
    
    $NS$.Channel.get($NS$.aid).pub('do_skippable');
};



PreviewInlineVideoIOS.prototype._doPlay = function() {
    this.video2.currentTime = 0;
    this.video.currentTime = 0;
    
    this.playing = true;
    $NS$.debug('playing');
    this._loop();
};

PreviewInlineVideoIOS.prototype._loop = function () {
    var self = this,
        lastTime = Date.now(),
        animationFrame,
        framesPerSecond = 25;
    this.startedAudio = false;
    // if (!this.video.muted) {
    //     this.audio.currentTime = this.video.currentTime;
    // }
    $NS$.debug('_loop');

    ~function r() {
        
        if (self.playing) {

            var time = Date.now(),
                elapsed = (time - lastTime) / 1000,
                currentTime = (Math.round(parseFloat(self.video.currentTime) * 10000) / 10000),
                duration = (Math.round(parseFloat(self.video.duration) * 10000) / 10000);

            if (elapsed >= ((1000 / framesPerSecond) / 1000)) {
                self.video.currentTime = self.video.currentTime + elapsed;
                
                self.ctx.drawImage(self.video, 0, 0, self.size.width, self.size.height);
                lastTime = time;
            }
            if (currentTime >= duration-0.15) {
                // playing = false;
                currentTime = 0;
                self.audio.pause();
                self.playing = false;
                self.startedAudio = false;
                $NS$.log('ENDED: currentTime: ' + currentTime + ' duration: ' + self.video.duration);
                // self.playedOnce ? msgSender('collapse') : self._againPreview();
                
                //maybe in read, thus close only if playback, not in preview
                



                // self.playback && msgSender('collapse' + '_' + $NS$.aid)
                self.playback && $NS$.Channel.get($NS$.aid).pub('canvasVideoEnded');


                window.setTimeout(function () {self._againPreview();}, 100);
                return;
            }
        } else {
            lastTime = Date.now();
        }
        animationFrame = requestAnimationFrame(r);
    }();
};

PreviewInlineVideoIOS.prototype._againPreview = function() {
    var self = this;
    this.playback = false;
    self.startedAudio = true;
    self.audio.currentTime = 0;
    this.cnv.style.cursor = 'pointer';
    // this.cnv.className = '';
    opaquePreview && (this.cnv.style.webkitFilter = 'brightness(0.5)');
    this.actionButton.className = loadedClass;
    this.actionButton.style.display = 'block';
    this.volumeSwitch.style.display = 'none';

    $NS$.dom.attr(this.cnv, 'stealth', 'stealth');

    $NS$.Channel.get($NS$.aid).pub('undo_skippable');

    $NS$.events.on(this.cnv, 'click', function () {
        if(!self.playback){
            self._startPlayback();
        }
    });
    
    // video.parentNode.removeChild(video);
    this._doPlay();
    
    return true;
};
PreviewInlineVideoIOS.prototype.checkHaveToPlay = function () {
    this.rushPlay && this._doPlay();
};
// PUBLIC
//
PreviewInlineVideoIOS.prototype.play = function () {
    this.playing = true;
    this.rushPlay = true;
    this.readyToPlay && this._doPlay();
};
PreviewInlineVideoIOS.prototype.pause = function () {
    this.playing = false;
    this.audio.pause();
    this.audio.currentTime = this.video.currentTime;
};
PreviewInlineVideoIOS.prototype.resume = function () {
    this.audio.currentTime = this.video.currentTime;
    this.playback && this.audio.play();
    this.playing = true;
};
PreviewInlineVideoIOS.prototype.seekTo = function (t) {
    t = t || 0;
    this.video.currentTime = t;
    this.video2.currentTime = t;
    this.audio.currentTime = t;
};
PreviewInlineVideoIOS.prototype.mute = function () {

    this.audio.pause();
    this.muted = true;
};
PreviewInlineVideoIOS.prototype.unmute = function () {
    this.audio.currentTime = this.video.currentTime;
    this.audio.play();
    this.muted = false;
};

PreviewInlineVideoIOS.prototype.onClickThrough = function () {},

PreviewInlineVideoIOS.prototype.skippable = function (sec) {
    var self = this,
        skippable;

    $NS$.Channel.get($NS$.aid).sub('undo_skippable', function () {
        setTimeout(function () {

            $NS$.dom.remove(skippable);  
        }, 100);
        
    });
    $NS$.Channel.get($NS$.aid).sub('do_skippable', function () {
        
        skippable = document.createElement('span');
        skippable.className = skippableClass;
        self.container.parentNode.appendChild(skippable);

        if (!sec) {

            $NS$.dom.remove(skippable);
        
        } else {

            s = parseInt(sec, 10);

            if (!!s) {
                $NS$.css.style(skippable, 'display', 'none');
                window.setTimeout(function () {
                    $NS$.css.style(skippable, 'display', 'block');
                }, ~~s*1e3);
            }
            
            $NS$.events.on(skippable, 'click', function () {
                $NS$.dom.remove(skippable);
                self.startedAudio = false;
                self.muted = true;
                $NS$.dom.attr(self.cnv, 'stealth', 'stealth');
                self._ended();
                
            });
        }
    });
};