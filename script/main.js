window.MS = window.MS || {};

/**
 * Initialize global functionality.
 *
 */
document.addEventListener('deviceready', function() {

    /*
     * Back navigation
     */
    if (device.platform === 'Android') {
        document.addEventListener("backbutton", function backbutton() {
            MS.navigator.back();
        }, false);
    }

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
    var isNotFresh;
    Step(
        function checkFlag() {
            isNotFresh = localStorage.getItem('isFresh');
            return true;
        },
        function createTables() {
            if (!isNotFresh) {
                MS.db.createTables(!isNotFresh, this);
            } else {
                return true;
            }
        },
        function insertDummyData() {
            if (!isNotFresh) {
                MS.dbDummy(this);
            } else {
                return true;
            }
        },
        function manageLogin() {
            localStorage.setItem('isFresh', true);

            var loggedInUser = localStorage.getItem('user_id');

            if (loggedInUser === 'null') {
                MS.navigator.goTo('login');

            } else {
                MS.user.autoLogIn(loggedInUser, function(err) {
                    if (err) {
                        MS.tools.toast.long(err);
                        MS.navigator.goTo('login');
                    } else {

                        // Close keyboard
                        MS.dom.overlay.find('#email').blur();
                        MS.dom.overlay.find('#pw').blur();

                        MS.timeline.init();

                        MS.navigator.goTo('news');
                    }
                });
            }
        }
    );

}, false);