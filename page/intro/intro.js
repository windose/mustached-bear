window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.intro = {

        /**
         *
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