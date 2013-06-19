window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    window.MS.user = {
        current: null,

        /**
         *
         * @param email
         * @param pw
         * @param callback
         * @param autoLoginId
         */
        login: function login(email, pw, callback, autoLoginId) {
            var sql, user;

            Step(
                /*
                 *
                 */
                function authenticate() {
                    sql = 'SELECT u.*, sgr.semester, sgr.id AS studiengruppe_id, sga.id AS studiengang_id ' +
                        'FROM user AS u ' +
                        'JOIN studiengruppe AS sgr ON u.studiengruppe_id = sgr.id ' +
                        'JOIN studiengang AS sga ON sgr.studiengang_id = sga.id ' +
                        (!autoLoginId?
                            'WHERE email = "'+MS.db.escape(email)+'" ' +
                                'AND password = "'+md5(pw)+'"' :

                            'WHERE u.id = '+MS.db.escape(autoLoginId));

                    console.log(sql);

                    MS.db.get(sql, this);

                },

                /*
                 *
                 */
                function getFaculties(err, data) {
                    if (err) { throw err; }

                    console.log(JSON.stringify(data));

                    if (data.length === 0) { throw 'User not found' }

                    user = data[0];

                    // Save id of the user in the cache, to prevent repeated login
                    localStorage.setItem('user_id', user.id);

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
                        'WHERE user_id = '+user.id;

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
                function final(err) {
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
         * Convenience function, wraps login.
         *
         * @param id
         * @param callback
         */
        autoLogIn: function autoLogIn(id, callback) {
            MS.user.login(undefined, undefined, callback, id);
        },

        /**
         *
         *
         * @param callback
         */
        update: function update(callback) {
            var sql;

            callback = callback || function() {};
            sql = 'SELECT * FROM user WHERE id="'+MS.db.escape(MS.user.current.id+'')+'"';

            MS.db.get(sql, function(err, data) {
                if (data.length === 0) {
                    callback('User not found');
                } else {
                    MS.user.current = data[0];
                    callback(undefined, data[0]);
                }
            });
        },

        /**
         *
         */
        logOut: function logOut() {
            MS.user.current = null;
            localStorage.setItem('user_id', null);
        }
    };

});