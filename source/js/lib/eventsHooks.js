$NS$.extendNS($NS$.events, function () {
    
    var hooks = {};


    function add (evString, fun) {
        if (!(evString in hooks))
            hooks[evString] = [];
        hooks[evString].push(fun);
    }

    function trigger(evString, params) {

    }

    function clear (evString) {
        if (!!evString && evString in hooks)
            hooks[evString] = [];
    }

    return {
        onplay : function(f) {add('onplay', f);},
        onpause : function(f) {add('onpause', f);},
        triggerHooks : trigger,
        clearHooks : clear
    };
});