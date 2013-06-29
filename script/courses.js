window.MS = window.MS || {};

(function() {

    window.MS.courses = {

        /**
         * Convenience function, returns every faculty.
         *
         * @param callback
         */
        getFaculties: function getFaculties(callback) {
            var sql;

            sql = 'SELECT id, name FROM fakultaet';

            MS.db.get(sql, callback);
        },

        /**
         * Retrieves the biggest semester count of one faculty.
         *
         * @param facultyId
         * @param callback
         */
        getMaxSemesterCount: function getMaxSemesterCount(facultyId, callback) {
            var sql;

            if (!facultyId) {
                callback('facultyId mandatory');
                return;
            }

            sql = 'SELECT MAX( s.semesterCount ) AS count ' +
                'FROM studiengang AS s ' +
                'JOIN fakultaet_studiengang AS fs ON s.id = fs.studiengang_id ' +
                'WHERE fs.fakultaet_id = ' + facultyId + ' ' +
                'GROUP BY fs.fakultaet_id ' +
                'LIMIT 0 , 30';

            MS.db.get(sql, function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    if (data.length === 0) {
                        callback(undefined, 7);
                    } else {
                        callback(undefined, data[0].count);
                    }
                }
            });
        },

        /**
         * Retrieves every course of a faculty.
         *
         * @param {number|String} facultyId
         * @param {number|String} semester
         * @param {number|String} [studygroupId]
         * @param {Function} callback
         */
        getCoursesBySem: function getCoursesBySem(facultyId, semester, studygroupId, callback) {
            var sql;

            sql =
                'SELECT v.*, f.name, f.info, sgr.semester, fs.fakultaet_id, sgr.name as studiengruppe_name ' +
                    'FROM vorlesung AS v ' +
                    'JOIN fach AS f ON v.fach_id = f.id ' +
                    'JOIN studiengruppe AS sgr ON sgr.id = v.studiengruppe_id ' +
                    'JOIN studiengang AS sga ON sgr.studiengang_id = sga.id ' +
                    'JOIN fakultaet_studiengang AS fs ON fs.studiengang_id = sga.id ' +
                    'WHERE fs.fakultaet_id = ' + facultyId + ' ' +
                    (!!studygroupId? 'AND sgr.id = ' + studygroupId + ' ' : '') +
                    'AND sgr.semester = ' + semester + ' ' +
                    'GROUP BY f.name ' +
                    'ORDER BY f.name ASC';

            MS.db.get(sql, callback);
        },

        /**
         *
         * @param {number|String} fachId
         * @param {number|String} semester
         * @param {number|String} [studygroupId]
         * @param {Function} callback
         */
        getCoursesByFach: function getCoursesByFach(fachId, semester, studygroupId, callback) {
            var sql;

            sql = 'SELECT *, sgr.name as studiengruppe_name FROM vorlesung AS v ' +
                'JOIN studiengruppe AS sgr ON sgr.id = v.studiengruppe_id ' +
                'WHERE v.fach_id = ' + fachId + ' ' +
                'AND sgr.semester = ' + semester + ' ' +
                (!!studygroupId? 'AND sgr.id = ' + studygroupId + ' ' : '') +
                'ORDER BY v.weekday ASC, v.start ASC';

            MS.db.get(sql, callback);
        },

        /**
         *
         *
         * @param facultyId
         * @param callback
         */
        getStudies: function getStudies(facultyId, callback) {
            MS.db.get(
                'SELECT id, name FROM studiengang AS s ' +
                    'JOIN fakultaet_studiengang AS fs ON fs.studiengang_id = s.id ' +
                    'WHERE fs.fakultaet_id = '+facultyId,
                callback
            );
        },

        /**
         *
         * @param studyId
         * @param sem
         * @param callback
         */
        getStudygroupsBySem: function getStudygroupsBySem(studyId, sem, callback) {
            MS.db.get(
                'SELECT id, name FROM studiengruppe ' +
                    'WHERE semester = '+sem+' ' +
                    'AND studiengang_id = '+studyId,
                callback
            );
        }

    };

})();