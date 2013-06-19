window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.courses = {

        /**
         * Basic functionality, touch highlighting and ui event handlers.
         * Will be called once.
         *
         * @param {Function} done
         * @param {Object} scope
         */
        init: function(done, scope) {

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

            Step(
                /*
                 * Get and draw faculties from database.
                 */
                function drawFaculties() {
                    var i, l, self, list, template;

                    self = this;
                    list = scope.header.find('select');
                    template = '<option value={{id}}>{{name}}</option>';

                    MS.courses.getFaculties(function(err, result) {

                        list.empty();
                        for (i=0, l=result.length; i<l; i++) {
                            list.append(Mustache.render(template, result[i]));
                        }

                        // Show the current users setting
                        MS.shim.select.showSelectItem(list,
                            MS.user.current.faculties[0]);

                        self();
                    });
                },

                /*
                 * Draw the top list of every semester dynamically.
                 */
                function drawSemList() {
                    var self = this;
                    MS.courses.getMaxSemesterCount(MS.user.current.faculties[0], function(err, count) {
                        if (err) {
                            return console.log(err.message);
                        }

                        MS.page.courses.drawSemList(scope, MS.user.current.faculties[0], count);
                        self();
                    });
                },

                /*
                 * Draw the list with desired courses dynamically.
                 */
                function drawCourseList() {
                    var self = this;

                    // Highlight current semester
                    scope.header.find('.semList')
                        .find('li').eq(MS.user.current.semester-1)
                        .addClass('active');

                    MS.courses.getCoursesBySem(
                        MS.user.current.faculties[0],
                        MS.user.current.semester,
                        function(err, courses) {
                        if (err) {
                            return console.log(err.message);
                        }

                        MS.page.courses.drawCourseList(scope, courses);

                        self();
                    });
                },

                /*
                 * UI Handler, switch between faculty.
                 */
                function facultyHandler(err) {
                    if (err) { console.log(err); }

                    scope.header.find('select').on('change', function() {
                        var self = $(this),
                            fak = self.val(),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent'),
                            semList = scope.header.find('.semList'),
                            sem = semList.find('.active').attr('data-target');

                        valueField.html(text);

                        /*
                         * Update semester list.
                         */
                        MS.courses.getMaxSemesterCount(fak, function(err, count) {
                            if (err) {
                                return console.log(err.message);
                            }
                            MS.page.courses.drawSemList(scope, fak, count);

                            /*
                             * Indicate current semester selection.
                             */
                            if (!sem) {
                                sem = MS.user.current.semester;
                            }

                            semList
                                .find('li[data-target='+sem+']')
                                .addClass('active');


                            /*
                             * Get and insert the corresponding courses.
                             */
                            MS.courses.getCoursesBySem(fak, sem,
                                function(err, courses) {
                                    if (err) {
                                        return console.log(err.message);
                                    }
                                    MS.page.courses.drawCourseList(scope, courses);
                                });
                        });
                    });

                    return true;
                },

                /*
                 * UI Handler, switch between semester.
                 */
                function semesterHandler(err) {
                    if (err) { console.log(err); }

                    scope.header.find('.semList').on('touchend', 'li', function() {
                        var self = $(this),
                            fak = scope.header.find('select').val(),
                            sem = self.attr('data-target');

                        /*
                         * Mark this element as active.
                         */
                        self.parent().find('.active').removeClass('active');
                        self.addClass('active');

                        /*
                         * Update course list.
                         */
                        MS.courses.getCoursesBySem(fak, sem,
                            function(err, courses) {
                                if (err) {
                                    return console.log(err.message);
                                }
                                MS.page.courses.drawCourseList(scope, courses);
                            });
                    });

                    return true;
                },

                /*
                 * UI Handler, toggle state of course on touch.
                 */
                function checkboxHandler(err) {
                    if (err) { console.log(err); }

                    scope.view.on('touchend', 'li', function() {
                        if (MS.isMove) { return; }

                        var self = $(this);
                        if (self.hasClass('on')) {
                            self.removeClass('on').addClass('off');
                        } else {
                            self.removeClass('off').addClass('on');
                        }
                    });

                    return true;
                },

                /*
                 * Go to the next phase.
                 */
                function finishLoad(err) {
                    if (err) { console.log(err); }

                    done();
                }
            );
        },

        /**
         * Do nothing yet.
         *
         * @param {Function} done
         */
        enter: function(done) {
            done();
        },

        /**
         * Do nothing yet.
         */
        leave: function() {},



        /**
         * Insert the semester list (for tab navigation) dynamically
         * into the header and manage the css classes.
         *
         * @param {Object} scope
         * @param {number} facultyId
         * @param {number} count
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
         * @param {Object} scope
         * @param {Array} courses
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