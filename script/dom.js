window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.dom = {
        window: $(window),
        wrapper: $('#wrapper'),
        body: $('#body'),
        sidebarLeft: $('#sidebarLeft'),
        sidebarRight: $('#sidebarRight'),
        header: $('#header'),
        footer: $('#footer'),
        content: $('#content'),
        overlay: $('#overlay')
    }

}, false);