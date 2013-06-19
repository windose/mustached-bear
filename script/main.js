window.MS = window.MS || {};

/**
 * Initialize global functionality.
 *
 */
document.addEventListener('deviceready', function() {

    // TODO, buggy
    //            if (device.platform === 'Android') {
    //                document.addEventListener("backbutton", function backbutton() {
    //                    MS.navigator.back();
    //                }, false);
    //            }

    /*
     * Sidebar. Height hack, touch highlighting and navigation event handlers.
     */
    $('.sidebar').height(MS.dimens.viewport.height);

    MS.dom.sidebarLeft.on('touchstart', 'li', function() {
        $(this).addClass('touch');
    });

    MS.dom.sidebarLeft.on('touchend', 'li', function() {
        MS.navigator.goTo($(this).attr('data-target'));
    });
    MS.dom.body.on('touchend', function() {
        if(MS.dom.body.hasClass('open-menu')) {
            MS.navigator.back();
        }
    });

    /*
     * Manage a move flag, to differ between touch and swipe input.
     */
    MS.dom.window.on('touchmove', function() {
        MS.isMove = true;
    });
    MS.dom.window.on('touchend', function() {
        $('.touch').removeClass('touch');
        MS.isMove = false;
    });

    /*
     * Create tables in case of empty database.
     * Get the logged in user and show start page.
     */
    MS.db.createTables(true, function() {

        // Insert dummy data
        MS.dbDummy(function() {

            var loggedInUser = localStorage.getItem('user_id');

            if (loggedInUser === 'null') {
                MS.navigator.goTo('Login');

            } else {
                MS.user.autoLogIn(loggedInUser, function(err) {
                    if (err) {
                        console.log(err);
                        MS.navigator.goTo('Login');
                    } else {

                        // Close keyboard
                        MS.dom.overlay.find('#email').blur();
                        MS.dom.overlay.find('#pw').blur();

                        MS.timeline.init();

                        MS.navigator.goTo('News');
                    }
                });
            }
        });
    });

}, false);