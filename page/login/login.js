window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.login = {
        init: function(scope) {
            log('init login');
            /* set background image size to prevent keyboard bug */
            scope.overlay.css('background-size', 'auto '+MS.dimens.viewport.height+'px');

            scope.overlay.find('.submit').on('touchstart', function() {
                $(this).addClass('touch');
            });

            scope.overlay.find('.submit').on('touchend', function() {
                MS.navigator.goTo('News');
            });
            scope.overlay.find('p').on('touchend', function() {
                var target = $(this).attr('data-target');
                MS.navigator.goTo(target);
            });
        },
        enter: function(done, scope) {
            log('enter login');

            MS.dom.body.addClass('bo');
            done();
        },
        leave: function() {
            log('leave login');

            MS.dom.body.removeClass('bo');
        }
    };

})();