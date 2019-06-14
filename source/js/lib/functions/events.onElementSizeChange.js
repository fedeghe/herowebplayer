function onElementSizeChange(elm, callback, dim, to) {
    to = to || 200;

    var lastHeight = elm.clientHeight,
        newHeight,
        lastWidth = elm.clientWidth,
        newWidth,
        reactToHeight = typeof dim === 'undefined' || dim.match(/height/),
        reactToWidth = typeof dim === 'undefined' || dim.match(/width/);

    (function run() {

        newHeight = elm.clientHeight;
        newWidth = elm.clientWidth;

        if (
            (reactToHeight && lastHeight != newHeight) ||
            (reactToWidth && lastWidth != newWidth)
        ) callback();

        lastHeight = newHeight;
        lastWidth = newWidth;

        elm.onElementHeightChangeTimer && clearTimeout(elm.onElementHeightChangeTimer);
        elm.onElementHeightChangeTimer = setTimeout(run, to);
    })();
}