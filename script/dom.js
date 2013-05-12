window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.dom = {
        window: $(window),
        body: $('#body'),
        sidebarLeft: $('#sidebarLeft'),
        sidebarRight: $('#sidebarRight'),
        header: $('#header'),
        content: $('#content')
    }

}, false);