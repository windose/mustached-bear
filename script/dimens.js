window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.dimens = {
        viewport: {
            height: MS.dom.window.height(),
            width: MS.dom.window.width(),

            update: function update() {
                MS.dimens.window.height = MS.dom.window.height();
                MS.dimens.window.width = MS.dom.window.width();
            }
        },
        header: {
            height: MS.dom.header.outerHeight(),
            width: MS.dom.header.outerWidth(),

            update: function update() {
                MS.dimens.header.height = MS.dom.header.outerHeight();
                MS.dimens.header.width = MS.dom.header.outerWidth();
            }
        }
    };

}, false);