/**
 * ANDROID version
 */
function PreviewInlineVideoANDROID (v) {

    var sources,
        self = this;
    // v.load();

    this.size = {
        height : v.clientHeight,
        width : v.clientWidth
    };
    this.playing = true;
    this.video = v;
    
    sources = [].slice.call(this.video.getElementsByTagName('source'), 0);

    this.muted = false;
    
    this.videoLoaded = false;
    this.readyToPlay = false;

    /**
     * append sources
     */
    
    
    
    this.video.setAttribute('preload', 'preload');
    this.video.setAttribute('muted', 'muted');
    
    

    this.parent = v.parentNode;

    
    
    
    this.container = $NS$.dom.wrap(this.video);
    this.container.className = 'respfixed'; // only JMVC
    this.container.style.display = 'inline-block';
    // this.container.style.width = this.size.width + 'px';
    // this.container.style.height = this.size.height + 'px';
    this.container.style.position = 'relative';
    this.container.style.left = 0;
    this.container.style.top = 0;


    this.volumeSwitch = document.createElement('span');
    this.volumeSwitch.className = volumeActive;
    // this.volumeSwitch.style.zIndex = 401;
    // this.volumeSwitch.style.width = this.size.width / 10 + 'px';
    this.volumeSwitch.style.cursor = 'pointer';
    this.volumeSwitch.style.color = 'black';
    // this.volumeSwitch.style.textShadow = '0px 0px 5px #fff';
    this.volumeSwitch.style.display = 'none';

    this.actionButton = document.createElement('span');
    this.actionButton.className = spinnerClass;
    /*
    this.actionButton.style.pointerEvents = 'none';
    this.actionButton.style.color = 'black';
    this.actionButton.style.cursor = 'pointer';
    this.actionButton.style.textShadow = '0px 0px 5px #fff';
    // this.actionButton.style.zIndex = 301;
    */
    this.rushPlay = v.hasAttribute('autoplay');
    
    

    // this.video.style.display = "none";
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
    

    // append
    this.container.parentNode.appendChild(this.volumeSwitch);
    this.container.parentNode.appendChild(this.actionButton);
            
    this.parent.appendChild(this.container);

    //
    //=====================================================
    //
    (this.video.readyState == 4 && self._videoIsLoaded())
    || /// on android is 'loadeddata'
    this.video.addEventListener('loadeddata', function() {
        
        self._videoIsLoaded();
    }, false);
    

    this.volumeSwitch.addEventListener('click', function () {
        self.volumeSwitch.className = self.muted ? volumeActive : volumeInactive;
        self[self.muted ? 'unmute' : 'mute']();
    });
}
PreviewInlineVideoANDROID.prototype = {

    _videoIsLoaded : function () {
        var self = this,
            started = false,
            W = window;

        this.videoLoaded = true;

        // function videoStart() {
            
        //     if (started) return;
        //     started = true;
        //     self._readyToPreview();
        //     $NS$.log('first touch');
        //     // remove from the window and call the function we are removing
        //     // this.removeEventListener('scroll', videoStart);
        //     this.removeEventListener('touchstart', videoStart);
        //     this.removeEventListener('click', videoStart);
        //     // this.removeEventListener('touchmove', videoStart);
        //     // this.removeEventListener('touchend', videoStart);

        // }
        
        // window.addEventListener('touchstart', videoStart);
        // window.addEventListener('click', videoStart);


        try{
            self._readyToPreview();
        } catch (e) {};


        window.addEventListener('message', function(event) {
            if ('message' in event.data && event.data.message == ('touched' + '_' + $NS$.aid)) {
                self._readyToPreview();
            }
            return;
        });

        this.readyToPlay = true;
    },

    _readyToPreview : function () {
        var self = this;

        self.video.setAttribute('muted', 'muted');  
        self.video.volume = 0;
        $NS$.dom.attr(self.video, 'stealth', 'stealth');

        self.video.addEventListener('click', function _() {

            self.actionButton.style.display = 'none';
            opaquePreview && (self.video.style.webkitFilter = 'brightness(1)');

            $NS$.dom.removeAttr(self.video, 'stealth');
            
            //volumeswitch
            self.volumeSwitch.style.display = 'block';
            self.video.currentTime = 0;

            self.video.removeAttribute('loop');
            self.video.removeAttribute('muted');
            self.video.volume = 1;

            self.video.removeEventListener('click', _);
            self.video.addEventListener('ended', self._ended);
            $NS$.Channel($NS$.aid).pub('do_skippable');
        });
        self._startPreview();
        return true;
    },

    _ended : function () {
        var self = this;
        $NS$.dom.attr(self.video, 'stealth', 'stealth');
        $NS$.Channel($NS$.aid).pub('undo_skippable');
        self.video.setAttribute('muted', 'muted');  
        self.video.volume = 0;
        self.mute();
        self.actionButton.style.display = 'block';
        self.volumeSwitch.style.display = 'none';
        msgSender('collapse' + '_' + $NS$.aid);
    },



    _startPreview : function () {
        var self = this;
        self.video.style.cursor = 'pointer';
        opaquePreview && (self.video.style.webkitFilter = 'brightness(0.5)');
        self.actionButton.className = loadedClass;
        self.video.setAttribute('muted', 'muted');  
                self.video.volume = 0;
        self._doPlay();
    },

    _doPlay : function() {
        
        this.video.currentTime = 0;
        this.playing = true;
        $NS$.debug('playing');
        this._loop();
    },

    _loop : function () {
        var self = this;
        self.video.setAttribute('loop', 'loop');
        self.video.play();
    },

    _againPreview : function() {
        
        this.video.style.cursor = 'pointer';
        // this.cnv.className = '';
        opaquePreview && (this.video.style.webkitFilter = 'brightness(0.5)');
        this.actionButton.className = loadedClass;
        this.actionButton.style.display = 'block';

        // video.parentNode.removeChild(video);
        this._doPlay();
        
        return true;
    },
    checkHaveToPlay : function () {
        this.rushPlay && this._doPlay();
    },
    // PUBLIC
    //
    play : function () {
        this.playing = true;
        this.rushPlay = true;
        this.readyToPlay && this._doPlay();
    },
    pause : function () {
        this.playing = false;
        this.video.pause();
    },
    resume : function () {
        this.video.play();
        this.playing = true;
    },
    seekTo : function (t) {
        t = t || 0;
        this.video.currentTime = t;
    },
    mute : function () {
        this.video.setAttribute('muted', 'muted');
        this.video.volume = 0;
        this.muted = true;
    },
    unmute : function () {
        this.video.removeAttribute('muted');
        this.video.volume = 1;
        this.muted = false;
    },

    skippable : function (sec) {

        var self = this;
        $NS$.Channel($NS$.aid).sub('do_skippable', function () {
            
            var skippable = document.createElement('span');
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
                    self._ended();
                    
                });
            }
        });
    }
};