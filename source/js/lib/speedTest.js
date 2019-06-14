$NS$.makeNS('$NS$/util');

(function () {

    var imageAddr = "//$DOMAIN$" + "$TEST_IMG_PATH$",
    // var imageAddr = "https://$DOMAIN$" + "$TEST_IMG_PATH$",
    // var imageAddr = "$DEFAULT_PROTO$//$DOMAIN$" + "$TEST_IMG_PATH$",

        // these are expressed in Kbps
        // 
        ranges = {
            light : [$BANDWIDTH_HIGH2LIGHT$, Infinity],
            high : [$BANDWIDTH_MEDIUM2HIGH$, $BANDWIDTH_HIGH2LIGHT$],
            medium : [$BANDWIDTH_LOW2MEDIUM$, $BANDWIDTH_MEDIUM2HIGH$],
            low : [0, $BANDWIDTH_LOW2MEDIUM$]
        };

    $NS$.util.connection = {
        bps : 0,
        Kbps : 0,
        Mbps : 0,
        Bps : 0,
        KBps : 0,
        MBps : 0,
        ms : 0,
        bytes : 0,
        qos : undefined
    };

    // public
    // return the promise to make a new test
    // receiving bpms
    //
    ($NS$.util.testConnection = function () {
        var P = $NS$.Promise.create(),
            img = new Image,
            xhr = new XMLHttpRequest(),
            start, end, tot;

        xhr.responseType = 'blob';
        xhr.open('GET', imageAddr + "?cb=" + +new Date, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            img.src = window.URL.createObjectURL(new Blob([this.response]));
            end = +new Date;
            P.done(tot/(end-start), end-start, tot);
        };
        xhr.onprogress = function(e) {
            tot = e.total;
            parseInt(img.completedPercentage = (e.loaded / e.total) * 100);
        };
        xhr.onloadstart = function() {
            img.completedPercentage = 0;
        };
        start = +new Date;
        xhr.send();

        return P;
    })

    // call it and 
    // it values both
    // - $NS$.util.connectionSpeed
    // - $NS$.util.qos
    ().then(function (p, r) {

        var Bpms = parseFloat(r[0], 10),
            Bps = Bpms * 1000,
            bps = Bps * 8,
            KBps = Bps / 1024,
            Kbps = KBps * 8,
            MBps = KBps / 1024,
            Mbps = MBps * 8,
            mstime = r[1],
            totB = r[2],
            i;

        $NS$.util.connection.bps = parseFloat(bps.toFixed(2), 10);
        $NS$.util.connection.Bps = parseFloat(Bps.toFixed(2), 10);
        $NS$.util.connection.Kbps = parseFloat(Kbps.toFixed(2), 10);
        $NS$.util.connection.KBps = parseFloat(KBps.toFixed(2), 10);
        $NS$.util.connection.Mbps = parseFloat(Mbps.toFixed(2), 10);
        $NS$.util.connection.MBps = parseFloat(MBps.toFixed(2), 10);
        
        $NS$.util.connection.ms = mstime;
        $NS$.util.connection.bytes = totB;

        for (i in ranges){
            if ($NS$.util.connection.Kbps > ranges[i][0] && $NS$.util.connection.Kbps <= ranges[i][1]) {
                $NS$.util.connection.qos = i;
                break;
            }
        }
        
        // publish the event that will unleash Engy in the main.js
        //
        $NS$.Channel($NS$.id).pub('gotBandWidth');
    });
})();

