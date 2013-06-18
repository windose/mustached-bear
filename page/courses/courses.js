window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.courses = {

        /**
         * Basic functionality, touch highlighting and event handlers.
         * Will be called once.
         *
         * @param scope
         */
        init: function(scope) {

            /*
             * Touch highlighting.
             */
            scope.header.on('touchstart', '.mheader, .semList li', function() {
                $(this).addClass('touch');
            });
            scope.view.on('touchstart', 'label, .footer span', function() {
                $(this).addClass('touch');
            });
            scope.view.on('touchmove', 'label', function() {
                $(this).removeClass('touch');
            });

            /*
             * Switch between faculty.
             */
            scope.header.find('select').on('change', function() {
                var self = $(this),
                    fak = self.val(),
                    text = self.find(':selected').text(),
                    valueField = self.parent().find('.selectContent'),
                    sem = scope.view.find('ul').attr('data-sem');

                MS.page.courses.getMaxSemesterCount(fak, function(err, count) {
                    if (err) {
                        return console.log(err.message);
                    }
                    MS.page.courses.drawSemList(scope, fak, count);
                });

                MS.page.courses.getCourses(fak,
                    (sem || MS.user.current.semester),
                    true, function(err, courses) {
                    if (err) {
                        return console.log(err.message);
                    }
                    MS.page.courses.drawCourseList(scope, courses);
                });

                valueField.html(text);
            });

            /*
             * Switch between semester.
             */
            scope.header.find('.semList').on('touchend', 'li', function() {
                var self = $(this),
                    sem = $(this).attr('data-target');

                scope.view.find('ul')
                    .removeClass('sem'+sem)
                    .attr('data-sem', sem)
                    .addClass('sem'+sem);

                self.parent().find('.active').removeClass('active');
                self.addClass('active');

                MS.page.courses.getCourses(fak, sem, true,
                    function(err, courses) {
                        if (err) {
                            return console.log(err.message);
                        }
                        MS.page.courses.drawCourseList(scope, courses);
                    });
            });

            /*
             * Toggle state of course on touch.
             */
            scope.view.on('touchend', 'li', function() {
                if (MS.isMove) { return; }

                var self = $(this);
                if (self.hasClass('on')) {
                    self.removeClass('on').addClass('off');
                } else {
                    self.removeClass('off').addClass('on');
                }
            });


            /*
             * Get and insert faculties from database.
             */
            var fakList,
                fakTemplate;

            fakList = scope.header.find('select');
            fakTemplate = '<option value={{id}}>{{name}}</option>';

            MS.db.get(
                'SELECT id, name FROM fakultaet',
                function(err, result) {
                    var i, l;
                    fakList.empty();
                    for (i=0, l=result.length; i<l; i++) {
                        fakList.append(Mustache.render(fakTemplate, result[i]));
                    }
                }
            );

            Step(
                /*
                 * Draw the top list of every semester dynamically.
                 */
                function insertSemList() {
                    var done = this;
                    MS.page.courses.getMaxSemesterCount(MS.user.current.faculties[0], function(err, count) {
                        if (err) {
                            return console.log(err.message);
                        }

                        MS.page.courses.drawSemList(scope, MS.user.current.faculties[0], count);
                        done();
                    });
                },

                /*
                 * Draw the list with desired courses dynamically.
                 */
                function insertCourseData() {
                    var done = this;

                    scope.view.find('li:nth-child('+(MS.user.current.semester-1)+')').addClass('active');

                    MS.page.courses.getCourses(
                        MS.user.current.faculties[0],
                        MS.user.current.semester,
                        true, function(err, courses) {
                        if (err) {
                            return console.log(err.message);
                        }

                        MS.page.courses.drawCourseList(scope, courses);
                        done();
                    });
                }
            );
        },

        /**
         * Do nothing yet.
         *
         * @param done
         * @param scope
         */
        enter: function(done) {
            done();
        },

        /**
         * Do nothing yet.
         */
        leave: function() {},

        /**
         * Retrieves every course of a faculty. If the <isOwnFaculty> flag
         * is set, it will retrieve only the courses of the studiengruppe
         * of the logged in user.
         *
         * @param facultyId
         * @param isOwnFaculty
         * @param callback
         */
        getCourses: function getCourses(facultyId, semester, isOwnFaculty, callback) {
            var sql;

            sql =
                'SELECT v.*, f.name, f.info, sgr.semester, fs.fakultaet_id ' +
                'FROM vorlesung AS v ' +
                'JOIN fach AS f ON v.fach_id = f.id ' +
                'JOIN studiengruppe AS sgr ON sgr.id = v.studiengruppe_id ' +
                'JOIN studiengang AS sga ON sgr.studiengang_id = sga.id ' +
                'JOIN fakultaet_studiengang AS fs ON fs.studiengang_id = sga.id ' +
            (isOwnFaculty?
                'JOIN user_vorlesung AS uv ON uv.vorlesung_id = v.id '+
                'JOIN user AS u ON uv.user_id = u.id ':'')+
                'WHERE fs.fakultaet_id = ' + facultyId + ' ' +
                'AND sgr.semester = ' + semester + ' ' +
            (isOwnFaculty?
                'AND v.studiengruppe_id = u.studiengruppe_id '+
                'AND u.id = '+ MS.user.current.id :'');

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
         * Insert the semester list (for tab navigation) dynamically
         * into the header and manage the css classes.
         *
         * @param scope
         * @param facultyId
         * @param count
         */
        drawSemList: function drawSemList(scope, facultyId, count) {
            var semList,
                template;

            semList = scope.header.find('.semList');

            semList
                .removeClass('w'+semList.attr('data-w'))
                .removeClass('fak'+semList.attr('data-fak'))
                .addClass('w'+count)
                .addClass('fak'+facultyId)
                .attr('data-w', count)
                .attr('data-fak', facultyId);

            template = '<li data-target="{{i}}">{{i}}</li>';

            semList.empty();
            for (;count--;) {
                semList.prepend(Mustache.render(template, {i:count+1}));
            }
        },

        /**
         * Inserts the course list dynamically into the content body.
         *
         * @param scope
         * @param courses
         */
        drawCourseList: function drawCourseList(scope, courses) {
            var courseList, template, i, weekdays;

            courseList = scope.view.find('ul');

            weekdays = [
                'Montag',
                'Dienstag',
                'Mittwoch',
                'Donnerstag',
                'Freitag',
                'Samstag',
                'Sonntag',
            ];

            template = '<li class="off"><label class="cf"><table><tr>'+
                '<td><img class="on" src="./asset/icon/iconmoon-bbb9bc/checkbox-checked.png"><img class="off" src="./asset/icon/iconmoon-bbb9bc/checkbox-unchecked.png"></td>' +
                '<td class="label">{{c.name}}<br>Jeden {{weekday}} {{c.start}}-{{c.end}}, {{c.raum}} bei {{c.dozent}}</td>' +
                '</tr></table></label></li>';

            courseList.empty();
            for (i=courses.length; i--;) {
                courseList.prepend(Mustache.render(template, {
                    weekday: weekdays[courses[i].weekday],
                    c: courses[i]
                }));
            }
        }
    };

})();