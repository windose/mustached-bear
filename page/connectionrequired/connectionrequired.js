window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.connectionrequired = {

        /**
         *
         * @param done
         * @param scope
         */
        init: function(done, scope) {
            done();
        },

        /**
         *
         * @param done
         * @param scope
         */
        enter: function(done, scope) {
            // Blackout the content body to prevent tearing effects
            MS.dom.body.addClass('bo');

            done();
        },

        /**
         *
         */
        leave: function() {
            MS.dom.body.removeClass('bo');
        }
    };

})();