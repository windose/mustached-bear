window.MS = window.MS || {};

(function() {

    MS.tools = {

        /**
         *
         *
         * @param {string} str
         * @returns {string}
         */
        capitalizeFirst: function capitalizeFirst(str) {
            return str? str.charAt(0).toUpperCase() + str.slice(1) : '';
        },


        toast: {

            /**
             *
             *
             * @param {string} str
             * @param {Function} [callback]
             */
            long: function long(str, callback) {
                Toast.longshow(str, function() {
                    callback();
                }, function(err) {
                    callback(err);
                });
            },

            /**
             *
             *
             * @param {string} str
             * @param {Function} [callback]
             */
            short: function short(str, callback) {
                Toast.shortshow(str, function() {
                    callback();
                }, function(err) {
                    callback(err);
                });
            }
        }

    }

})();