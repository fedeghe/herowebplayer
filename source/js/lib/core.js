(function (ns){
    // this is due, to test all implications see
    // http://www.jmvc.org/test_strict?ga=false
    // (the ga=false params inhibits google analytics tracking)
    "use strict";


    var allowLog = true,
        allowDebug = $DEBUG_MESSAGES$;

    /**
     * Creates a namespace
     * @param  {String} str     dot or slash separated path for the namespace
     * @param  {Object literal} [{}]obj optional: the object to be inserted in the ns, or a function that returns the desired object
     * @param  {[type]} ctx     [window] the context object where the namespace will be created
     * @return {[type]}         the brand new ns
     *
     * @hint This method is DESTRUCTIVE if the obj param is passed,
     *       a conservative version is straight-forward
     * @sample
     *     makens('SM', {hello: ...});
     *     makens('SM', {hi: ...}); // now hello exists no more
     *
     *     //use
     *     makens('SM', {hello: ..., hi: })
     
     *     // or if in different files
     *     // file1     
     *     makens('SM')
     *     SM.hello = ...
     *     //
     *     // file2
     *     makens('SM')
     *     SM.hi = ...
     *
     *     makens('SM/proto', function () {
     *
     *          // some private stuff
     *          //
     *          
     *          return {
     *              foo0 : function () {...},
     *              foo1 : function () {...}
     *          }
     *     })
     *     
     */
    function makens(str, obj, ctx) {
        str = str.replace(/^\//, '');
        var chr = '.',
            els = str.split(/\.|\//),
            l = els.length,
            _u_ = 'undefined',
            ret;
        (typeof ctx === _u_) && (ctx = window);
        (typeof obj === _u_) && (obj = {});
        //
        
        if (!ctx[els[0]]) {
            
            ctx[els[0]] = (l === 1) ? (typeof obj == 'function' ? obj() : obj) : {};
            // ctx[els[0]] = (l === 1) ? obj : {};
        }
        ret = ctx[els[0]];

        //
        // senti maaaa
        //
        // ret = ctx[els[0]] || (l === 1 ? (typeof obj == 'function' ? obj() : obj) : {});
        //
        // che ti pare brutto?
        // 
         
        return (l > 1) ? makens(els.slice(1).join(chr), obj, ctx[els[0]]) : ret;
    }


    function checkns(ns, ctx) {
        // if (ns == undefined) {
        //     debugger;
        // }
        ns = ns.replace(/^\//, '');
        var els = ns.split(/\.|\//),
            i = 0,
            l = els.length;
        ctx = (ctx !== undefined) ? ctx : W;

        if (!ns) return ctx;

        for (null; i < l; i += 1) {

            if (typeof ctx[els[i]] !== 'undefined') {
                ctx = ctx[els[i]];
            } else {
                // break it
                return undefined;
            }
        }
        return ctx;
    }

    function extendns(ns, objfn) {
        var i,
            obj = typeof objfn === 'function' ? objfn() : objfn;
        for (i in obj) {
            if (typeof ns[i] == 'undefined') {
                ns[i] = obj[i];
            }
        }
    }


    // use makens to publish itself and something more
    //
    makens(ns, {
        id : ns + "---" + ~~(1000 * Math.random()),

        makeNS : makens,
        
        checkNS : checkns,

        extendNS : extendns,

        // debug : function (f) {
        //     debugActive = !!f;
        // },
        debug : function () {
            if (!allowDebug) {return void 0;}
            var args = Array.prototype.slice.call(arguments, 0);
            'debug' in console && console.debug.apply(console, args);
        },

        log : function () {
            if (!allowDebug) {return void 0;}
            var args = Array.prototype.slice.call(arguments, 0);
            allowLog && 'log' in console && console.log.apply(console, args);
        },

        dir : function () {
            if (!allowDebug) {return void 0;}
            var args = Array.prototype.slice.call(arguments, 0);
            allowLog && 'dir' in console && console.dir.apply(console, args);
        },

        info : function () {
            if (!allowDebug) {return void 0;}
            var args = Array.prototype.slice.call(arguments, 0);
            allowLog && 'info' in console && console.info.apply(console, args);
        },

        dbg : function (m) {
            if (!allowDebug) {return void 0;}
            try {console.log(m);} catch(e1) {try {opera.postError(m);} catch(e2){alert(m);}}
        }
    });


    // use it again to define a function to get
    // uniqueid
    makens(ns + '.utils', {
        /**
         * useful to get a unique id string
         * @return {String} the wanted id
         */
        uniqueId : new function () {
            var count = 0,
                self = this;
            this.prefix = ns + '_';
            this.toString = function () {
                return  self.prefix + ++count;
            }
        }
    });


// base ns 
})('$NS$');