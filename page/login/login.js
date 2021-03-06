window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.login = {

        /**
         * Basic functionality, touch highlighting and event handlers.
         * Will be called once.
         *
         * @param {Function} done
         * @param {Object} scope
         */
        init: function(done, scope) {
            // set background image size to prevent keyboard bug
            scope.overlay.css('background-size', 'auto '+MS.dimens.viewport.height+'px');

            /*
             * UI Handler, touch highlighting.
             */
            scope.overlay.find('.button').on('touchstart', function() {
                $(this).addClass('touch');
            });

            /*
             * UI Handler, try to log in with the supported
             * data of the input fields.
             */
            scope.overlay.find('.submit').on('touchend', function() {
                var email,
                    pw;

                // Get log in data
                email = scope.overlay.find('#email').val();
                pw = scope.overlay.find('#pw').val();

                // Save last entered email for convenience
                localStorage.setItem('last_email', email);

                if (pw === '') {
                    MS.tools.toast.short('Bitte Passwort eingeben');
                    return;
                }

                // Try to log in
                MS.user.login(email, pw, function(err) {
                    if (err) {
                        MS.tools.toast.short(err);
                        return;
                    }

                    // Save userId for auto login
                    localStorage.setItem('user_id', MS.user.current.id);

                    // Set user theme
                    MS.theme.init();

                    // Go to the news page, in case of a successful authorization
                    MS.navigator.goTo('news');
                });
            });

            /*
             * UI Handler, go to registration.
             */
            scope.overlay.find('.register').on('touchend', function() {
                MS.navigator.goTo('intro');
            });

            /*
             * UI Handler, forgot password.
             */
            scope.overlay.find('.forgotpw').on('touchend', function() {
                MS.navigator.goTo('forgotpw');
            });

            /*
             * UI Handler, navigate to the register or lost
             * password view.
             */
            scope.overlay.find('p').on('touchend', function() {
                var target = $(this).attr('data-target');
                MS.navigator.goTo(target);
            });

            done();
        },

        /**
         * A user will enter this fragment on first load and logout.
         * Resets the input fields.
         *
         * @param done
         * @param scope
         */
        enter: function(done, scope) {

            // Blackout the content body to prevent tearing effects
            MS.dom.body.addClass('bo');

            if (MS.user.current) {
                // set theme to default
                MS.theme.set(false);

                // log out existing user
                MS.user.logOut();
            }

            /*
             * get last email address for convenience.
             */
            var lastEmail = localStorage.getItem('last_email');
            if (lastEmail) {
                scope.overlay.find('#email').val(lastEmail);
            }

            // clear password field
            scope.overlay.find('#pw').val('');

            // show page
            done();
        },

        /**
         * Remove the blackout class to show the body container.
         * ToDo move to navigator for every overlay.
         */
        leave: function() {
            MS.dom.body.removeClass('bo');
        }
    };

})();