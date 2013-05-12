window.MS = window.MS || {};

$(function() {

    MS.dimens = {
        viewport: {
            height: MS.dom.window.height(),
            width: MS.dom.window.width()
        },
        header: {
            height: MS.dom.header.height(),
            width: MS.dom.header.width()
        }
    };
});