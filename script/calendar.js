window.MS = window.MS || {};

(function() {

    var exec = cordova.require("cordova/exec");

    MS.Calendar = {

        /**
         * Returns every google calender account name
         * and their ids of the current user. The id is
         * required to insert new dates.
         *
         * @param {Function} callback
         */
        getCalendars: function(callback) {
            exec(function(msg) {
                var list, i, entry;

                list = {};
                msg = msg[0].replace(/[{}]+/g, '').split(', ');

                for (i=msg.length; i--;) {
                    entry = msg[i].split('=');
                    list[entry[0]] = entry[1];
                }

                callback(undefined, list);
            }, function(err){
                callback(err);
            }, "CalendarPlugin","getCalendars", []);
        },

        /**
         * Insert a new event for the user.
         *
         * @param {Object} options
         * @param {Function} [callback]
         */
        insertEvent: function(options, callback) {
            if (!('calId') in options) { callback('Missing calendar id'); return; }
            if (!('start') in options) { callback('Missing start time in millis'); return; }
            if (!('end') in options) { callback('Missing end time in millis'); return; }
            if (!('title') in options) { callback('Missing event title'); return; }

            exec(function(msg) {
                callback(undefined, msg);
            }, function(err){
                callback(err);
            }, "CalendarPlugin","insertEvent", [
                options.calId, options.start, options.end, options.title, options.description
            ]);
        },

        /**
         * Remove an event by his id.
         *
         * @param {number} id
         * @param {Function} [callback]
         */
        deleteEvent: function(id, callback) {
            callback = callback || function() {};

            exec(function(msg) {
                callback(undefined, msg);
            }, function(err){
                callback(err);
            }, "CalendarPlugin","deleteEvent", [id]);
        }
    };

})();