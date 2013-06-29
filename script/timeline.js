window.MS = window.MS || {};

(function() {

    MS.timeline = {

         /**
         * German weekdays.
         */
        weekdays: [
            'Montag',
            'Dienstag',
            'Mittwoch',
            'Donnerstag',
            'Freitag',
            'Samstag',
            'Sonntag',
        ],

        /**
         * Initializes momentjs with the german notation.
         */
        init: function() {
            /*
             * Set time to german.
             * Source: https://raw.github.com/timrwood/moment/develop/lang/de.js
             */
            moment.lang('de',{
                months : "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
                monthsShort : "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
                weekdays : "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
                weekdaysShort : "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
                weekdaysMin : "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
                longDateFormat : {
                    LT: "H:mm [Uhr]",
                    L : "DD.MM.YYYY",
                    LL : "D. MMMM YYYY",
                    LLL : "D. MMMM YYYY LT",
                    LLLL : "dddd, D. MMMM YYYY LT"
                },
                calendar : {
                    sameDay: "[Heute um] LT",
                    sameElse: "L",
                    nextDay: '[Morgen um] LT',
                    nextWeek: 'dddd [um] LT',
                    lastDay: '[Gestern um] LT',
                    lastWeek: '[letzten] dddd [um] LT'
                },
                relativeTime : {
                    future : "in %s",
                    past : "vor %s",
                    s : "ein paar Sekunden",
                    m : "einer Minute",
                    mm : "%d Minuten",
                    h : "einer Stunde",
                    hh : "%d Stunden",
                    d : "einem Tag",
                    dd : "%d Tagen",
                    M : "einem Monat",
                    MM : "%d Monaten",
                    y : "einem Jahr",
                    yy : "%d Jahren"
                },
                ordinal : '%d.',
                week : {
                    dow : 1, // Monday is the first day of the week.
                    doy : 4  // The week that contains Jan 4th is the first week of the year.
                }
            });
        },

        /**
         * Retrieves the dates in the future. It limits the db request to 20.
         * This is a potential problem, if the user has too much dates on a single
         * day. ToDo
         *
         * @param {Function} callback
         */
        getFutureDates: function getFutureDates(callback) {
            var sql, absDatetime, i, l, date, now;

            now = moment();
            sql = 'SELECT v.*, f.name, f.info ' +
                'FROM vorlesung AS v ' +
                'JOIN fach AS f ON f.id = v.fach_id ' +
                'JOIN user_vorlesung AS uv ON uv.vorlesung_id = v.id ' +
                'WHERE uv.user_id = ' + MS.user.current.id + ' ' +
                'ORDER BY v.weekday ASC LIMIT 20';

            MS.db.get(sql, function(err, dates) {
                if (err) {
                    MS.tools.toast.long(err.message);
                }

                /*
                 * Generate an absolute date object from the
                 * relative time data for further calculations.
                 */
                for (i=0, l=dates.length; i<l; i++) {
                    date = dates[i];
                    absDatetime = moment()
                        .day(date.weekday+1)
                        .hour(date.start.split(':')[0])
                        .minute(date.start.split(':')[1])
                        .second(0);

                    if (absDatetime.isBefore(now)) {
                        absDatetime.add('days', 7);
                    }

                    date.absDatetime = absDatetime;
                }

                /*
                 * Sort the dates, closest one first.
                 */
                dates = dates.sort(function(a, b) {
                    return a.absDatetime.valueOf() - b.absDatetime.valueOf();
                });

                callback(undefined, dates);
            });
        },

        /**
         * A mustache template for a date item in the timeline.
         */
        template: '<li>' +
            '<div class="title">{{name}}</div>' +
            '<div class="date">{{until}} ({{date}} um {{time}})</div>' +
            '<div class="desc">{{raum}} bei {{dozent}}</div>' +
            '</li>',

        /**
         * Inserts a single date into a timeline container.
         *
         * @param {Object} $timeline
         * @param {Object} date
         */
        insertDate: function insertDate($timeline, date) {
            var template;

            date.until = date.absDatetime.fromNow();
            date.date = date.absDatetime.format('DD.MM.YYYY');
            date.time = date.absDatetime.format('HH:mm');

            template = Mustache.render(MS.timeline.template, date);

            $timeline.append(template);
        }
    };

})();