window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.dom = {
        window: $(window),
        body: $('#body'),
        login: $('#login'),
        loginSubmit: $('#loginSubmit'),
        sidebarLeft: $('#sidebarLeft'),
        sidebarRight: $('#sidebarRight'),
        header: $('#header'),
        content: $('#content')
    }

}, false);