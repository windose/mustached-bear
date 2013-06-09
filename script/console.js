window.MS = window.MS || {};

(function() {

    window.MS.logdata = [];

    window.log = function log() {
        var args = Array.prototype.slice.call(arguments);
        MS.logdata.push(args);
        console.log.apply(console, args);
    };
})();