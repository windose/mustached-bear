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
            long: function(str, callback) {

                callback = callback || function() {};

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
            short: function(str, callback) {

                callback = callback || function() {};

                Toast.shortshow(str, function() {
                    callback();
                }, function(err) {
                    callback(err);
                });
            }
        }

    }

})();