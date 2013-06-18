window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.login = {
        init: function(scope) {
            /* set background image size to prevent keyboard bug */
            scope.overlay.css('background-size', 'auto '+MS.dimens.viewport.height+'px');

            scope.overlay.find('.submit').on('touchstart', function() {
                $(this).addClass('touch');
            });

            scope.overlay.find('.submit').on('touchend', function() {
                var email,
                    pw;

                email = scope.overlay.find('#email').val();
                pw = scope.overlay.find('#pw').val();

                // Save last entered email for convenience
                localStorage.setItem('last_email', email);

                MS.user.authorize(email, pw, function(err) {
                    if (err) {
                        return; //TODO show error
                    }

                    MS.navigator.goTo('News');
                });

            });
            scope.overlay.find('p').on('touchend', function() {
                var target = $(this).attr('data-target');
                MS.navigator.goTo(target);
            });
        },
        enter: function(done, scope) {
            MS.dom.body.addClass('bo');

            // log out existing user
            MS.user.logOut();

            // get last email adress for convenience
            var lastEmail = localStorage.getItem('last_email');
            if (lastEmail) {
                scope.overlay.find('#email').val(lastEmail);
            }

            // clear password field
            scope.overlay.find('#pw').val('');

            // show page
            done();
        },
        leave: function() {
            MS.dom.body.removeClass('bo');
        }
    };

})();