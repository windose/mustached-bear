window.MS = window.MS || {};

(function() {

    var exec = cordova.require("cordova/exec");

    MS.calendar = {

//        /**
//         *
//         * @param name
//         */
//        addCalendar: function(name, callback) {
//            exec(function(msg) {
//                callback(undefined, msg);
//            }, function(err){
//                callback(err);
//            }, "CalendarPlugin","addCalendar", [ name ]);
//        },

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

            if (!('description') in options) { options.description = ''; }
            if (!('location') in options) { options.location = ''; }

            exec(function(msg) {
                callback(undefined, {
                    uuid: options.uuid,
                    msg: msg
                });
            }, function(err){
                callback(err);
            }, "CalendarPlugin","insertEvent", [
                options.calId,
                options.start,
                options.end,
                options.title,
                options.description,
                options.location
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
        },

        /**
         *
         *
         * @param {number|String} calId
         * @param {Function} [callback]
         */
        synchronizeWith: function(calId, callback) {
            callback = callback || function() {};

            var events, dates, oldDates;

            Step(
                function getOldEvents() {
                    MS.user.getEvents(this);
                },
                function getDates(err, result) {
                    if (err) { throw err; }

                    oldDates = result;

                    MS.timeline.getFutureDates(this);
                },
                function filterDates(err, result) {
                    if (err) { throw err; }

                    dates = result;

                    dates = dates.filter(function(date) {
                        var isNew, i;

                        isNew = true;

                        for (i=oldDates.length; i--;) {
                            if (oldDates[i].vorlesung_id === date.id &&
                                oldDates[i].cal_id === parseInt(calId)) {
                                isNew = false;
                                break;
                            }
                        }

                        return isNew;
                    });

                    if (dates.length === 0) {
                        throw 'No new dates to synchronize';
                    }

                    return true;
                },
                function insertDates(err) {
                    if (err) { throw err; }

                    var group, i, l, date;

                    group = this.group();

                    for (i=0, l=dates.length; i<l; i++) {
                        date = dates[i];

                        MS.calendar.insertEvent({
                            uuid: i,
                            calId: calId,
                            start: date.absDatetime.valueOf(),
                            end: date.absDatetimeEnd.valueOf(),
                            title: date.name,
                            description: '', //date.info.replace(/\\n/g, '')
                            location: date.raum
                        }, group());
                    }
                },
                function saveNewEvents(err, result) {
                    if (err) { throw err; }

                    var sql, i;

                    sql = [];
                    events = result;

                    for (i=events.length; i--;) {
                        dates[events[i].uuid].event_id = events[i].msg;
                    }

                    for (i=dates.length; i--;) {
                        sql.push('INSERT INTO usercalendar (event_id, cal_id, user_id, vorlesung_id) ' +
                            'VALUES ("'+dates[i].event_id+'","'+calId+'","'+
                            MS.user.current.id+'","'+dates[i].id+'");');
                    }

                    MS.db.sql(sql, this);
                },
                function callCallback(err) {
                    callback(err, events);
                }
            );
        }
    };

})();