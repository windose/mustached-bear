window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    window.MS.user = {
        current: null,

        /**
         *
         * @param {String} email
         * @param {String} pw
         * @param {Function} callback
         */
        authenticate: function authenticate(email, pw, callback) {
            var sql;

            sql = 'SELECT id ' +
                'FROM user ' +
                'WHERE email = "'+MS.db.escape(email)+'" ' +
                'AND password = "'+md5(pw)+'"';

            MS.db.get(sql, callback);
        },

        /**
         *
         * @param {Function} [callback]
         */
        updateData: function updateData(callback) {
            var user, sql;

            user = MS.user.current;
            callback = callback || function() {};

            Step(

                /*
                 *
                 */
                function getStudy() {
                    sql = 'SELECT u.*, sgr.semester, sgr.id AS studiengruppe_id, sga.id AS studiengang_id ' +
                        'FROM user AS u ' +
                        'JOIN studiengruppe AS sgr ON u.studiengruppe_id = sgr.id ' +
                        'JOIN studiengang AS sga ON sgr.studiengang_id = sga.id ' +
                        'WHERE u.id = ' + MS.db.escape(user.id);

                    MS.db.get(sql, this);
                },

                /*
                 *
                 */
                function getFaculties(err, data) {
                    if (err) { throw err; }

                    if (data.length === 0) {
                        throw 'Benutzer nicht gefunden';
                    }

                    user = data[0];

                    sql = 'SELECT fakultaet_id ' +
                        'FROM fakultaet_studiengang ' +
                        'WHERE studiengang_id = '+MS.db.escape(user.studiengang_id);

                    MS.db.get(sql, this);
                },

                /*
                 *
                 */
                function getCurrentCourses(err, faculties) {
                    if (err) { throw err; }

                    var facultyList = [], i;
                    for (i=faculties.length; i--;) {
                        facultyList.push(faculties[i].fakultaet_id);
                    }
                    user.faculties = facultyList;

                    sql = 'SELECT vorlesung_id FROM user_vorlesung ' +
                        'WHERE user_id = '+MS.db.escape(user.id);

                    MS.db.get(sql, this);
                },

                /*
                 *
                 */
                function saveCourses(err, courseIds) {
                    if (err) { throw err; }

                    var courseList = [], i;
                    for (i=courseIds.length; i--;) {
                        courseList.push(courseIds[i].vorlesung_id);
                    }
                    user.courses = courseList;

                    return true;
                },

                /*
                 *
                 */
                function execCallback(err) {
                    if (err) {
                        callback(err);
                    } else {
                        MS.user.current = user;
                        callback(undefined, user);
                    }
                }
            );
        },

        /**
         *
         * @param {String} email
         * @param {String} pw
         * @param {Function} callback
         * @param {number} [autoLoginId]
         */
        login: function login(email, pw, callback, autoLoginId) {
            Step(
                /*
                 *
                 */
                function authenticate() {
                    var done = this;

                    if (email && pw) {
                        MS.user.authenticate(email, pw, function(err, data) {
                            if (err || data.length === 0) {
                                done('Benutzer nicht gefunden');
                            } else {
                                MS.user.current = {
                                    id: data[0].id
                                };
                                done();
                            }
                        });
                    } else {
                        MS.user.current = {
                            id: autoLoginId
                        };
                        done();
                    }
                },

                /*
                 *
                 */
                function getUserData(err) {
                    MS.user.updateData(function(err2) {
                        callback(err || err2);
                    });
                }
            );

        },

        /**
         * Convenience function, wraps login.
         *
         * @param id
         * @param callback
         */
        autoLogIn: function autoLogIn(id, callback) {
            MS.user.login(null, null, callback, id);
        },

        /**
         * Removes reference to the current logged-in user from
         * local storage. Thus resulting in a logged out state.
         */
        logOut: function logOut() {
            MS.user.current = null;
            localStorage.setItem('user_id', null);
        },

        /**
         * Writes a settings value into the user table
         * for the current user.
         *
         * @param {String} key
         * @param {String|number} value
         * @param {Function} [callback]
         */
        setSetting: function setSetting(key, value, callback) {

            callback = callback || function() {};

            MS.db.set('user',
                [key],
                [value],
                'id="'+MS.user.current.id+'"',
                function(err) {
                    if (err) {
                        MS.tools.toast.short(err);
                    }

                    MS.user.current[key] = value;
                    callback();
                });

        },

        /**
         *
         * @param entryList
         * @param callback
         */
        setCourses: function setCourses(entryList, callback) {
            var sql, i;

            callback = callback || function() {};

            sql = 'DELETE FROM user_vorlesung ' +
                'WHERE user_id = '+MS.user.current.id;

            MS.db.sql(sql, function(err) {
                if (err) {
                    callback(err);
                    return;
                }

                sql = [];
                for (i=entryList.length; i--;) {
                    sql.push('INSERT INTO user_vorlesung (user_id, vorlesung_id) ' +
                        'VALUES ('+MS.user.current.id+','+entryList[i]+');');
                }

                MS.db.sql(sql, function(err) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    MS.user.updateData(callback);
                });
            });
        }
    };

});