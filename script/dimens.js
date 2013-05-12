window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.dimens = {
        viewport: {
            height: MS.dom.window.height(),
            width: MS.dom.window.width()
        },
        header: {
            height: MS.dom.header.outerHeight(),
            width: MS.dom.header.outerWidth()
        }
    };

}, false);