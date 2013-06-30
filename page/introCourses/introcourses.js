window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.introcourses = {

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
            scope.content.on('touchstart', '.semList li', function() {
                $(this).addClass('touch');
            });
            scope.footer.on('touchstart', '.button', function() {
                $(this).addClass('touch');
            });
            scope.content.on('touchstart', 'li.fach, tr', function() {
                var self = this;
                setTimeout(function() {
                    if (MS.isMove) { return; }
                    $(self).addClass('touch');
                }, 50);
            });
            scope.content.on('touchmove', 'li.fach, tr', function() {
                $(this).removeClass('touch');
            });

            Step(
                /*
                 * Get and draw faculties from database.
                 */
                function drawFaculties() {
                    var i, l, self, list, template;

                    self = this;
                    list = scope.content.find('select');
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
                            MS.tools.toast.short(err.message);
                            return
                        }

                        MS.page.introcourses.drawSemList(scope, MS.user.current.faculties[0], count);
                        self();
                    });
                },

                /*
                 * UI Handler, switch between faculty.
                 */
                function facultyHandler(err) {
                    if (err) { MS.tools.toast.short(err); }

                    scope.content.find('select').on('change', function() {
                        var self = $(this),
                            fak = self.val(),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent'),
                            semList = scope.content.find('.semList'),
                            sem = parseInt(semList.find('.active').attr('data-target')),
                            sgrId;

                        valueField.html(text);

                        /*
                         * Update semester list.
                         */
                        MS.courses.getMaxSemesterCount(fak, function(err, count) {
                            if (err) {
                                MS.tools.toast.long(err.message);
                                return;
                            }
                            MS.page.introcourses.drawSemList(scope, fak, count);

                            /*
                             * Show only the current users studygroup entries
                             * in his semester.
                             */
                            if (sem === MS.user.current.semester) {
                                sgrId = MS.user.current.studiengruppe_id;
                            }

                            /*
                             * Get and insert the corresponding courses.
                             */
                            MS.courses.getCoursesBySem(fak, sem, sgrId,
                                function(err, courses) {
                                    if (err) {
                                        MS.tools.toast.long(err.message);
                                        return;
                                    }
                                    MS.page.introcourses.drawCourseList(scope, courses);
                                });
                        });
                    });

                    return true;
                },

                /*
                 * UI Handler, switch between semester.
                 */
                function semesterHandler(err) {
                    if (err) { MS.tools.toast.short(err); }

                    scope.content.find('.semList').on('touchend', 'li', function() {
                        var self = $(this),
                            fak = scope.content.find('select').val(),
                            sem = parseInt(self.attr('data-target')),
                            sgrId;

                        /*
                         * Mark this element as active.
                         */
                        self.parent().find('.active').removeClass('active');
                        self.addClass('active');

                        /*
                         * Show only the current users studygroup entries
                         * in his semester.
                         */
                        if (sem === MS.user.current.semester) {
                            sgrId = MS.user.current.studiengruppe_id;
                        }

                        /*
                         * Update course list.
                         */
                        MS.courses.getCoursesBySem(fak, sem, sgrId,
                            function(err, courses) {
                                if (err) {
                                    MS.tools.toast.short(err.message);
                                    return;
                                }
                                MS.page.introcourses.drawCourseList(scope, courses);
                            });
                    });

                    return true;
                },

                /*
                 * UI Handler, open lecture list.
                 */
                function lectureHandler(err) {
                    if (err) { MS.tools.toast.short(err); }

                    scope.content.on('touchend', '.courseList li.fach', function() {
                        if (MS.isMove) { return; }
                        var self, semList, sem, fachId, sgrId;

                        self = $(this);

                        /*
                         * Lecture parent element, draw lectures and open list.
                         */
                        if (self.hasClass('open')) {
                            self.next('.lectures').remove();
                            self.removeClass('open');
                            return;
                        }

                        semList = scope.content.find('.semList');
                        sem = parseInt(semList.find('.active').attr('data-target'));
                        fachId = self.attr('data-id');

                        /*
                         * Show only the current users studygroup entries
                         * in his semester.
                         */
                        if (sem === MS.user.current.semester) {
                            sgrId = MS.user.current.studiengruppe_id;
                        }

                        MS.courses.getCoursesByFach(fachId, sem, sgrId, function(err, data) {
                            if (err) {
                                MS.tools.toast.short(err.message);
                                return;
                            }

                            MS.page.introcourses.drawLectures(self, data);
                            self.addClass('open');
                        });
                    });

                    return true;
                },

                /*
                 * UI Handler, select checkbox.
                 */
                function checkboxHandler(err) {
                    if (err) { MS.tools.toast.short(err); }

                    scope.content.on('touchend', '.courseList tr', function() {
                        if (MS.isMove) { return; }
                        var self, id;

                        self = $(this);
                        id = self.attr('data-id');

                        if (self.hasClass('on')) {
                            self.removeClass('on').addClass('off');

                            MS.page.introcourses.tempCourseList.splice(MS.page.introcourses.tempCourseList.indexOf(id), 1);
                        } else {
                            self.removeClass('off').addClass('on');

                            MS.page.introcourses.tempCourseList.push(id);
                        }
                    });

                    return true;
                },

                /*
                 * UI Handler, updates the current users course list.
                 */
                function saveButtonHandler(err) {
                    if (err) { throw err; }

                    scope.footer.find('.button.by').on('touchend', function() {
                        MS.user.setCourses(MS.page.introcourses.tempCourseList, function(err) {
                            if (err) {
                                MS.tools.toast.short(err);
                                return;
                            }

                            MS.tools.toast.long('Kursliste erfolgreich gespeichert');
                            MS.navigator.goTo('news');
                        });
                    });

                    return true;
                },

                /*
                 * Go to the next phase.
                 */
                function finishLoad(err) {
                    if (err) { MS.tools.toast.short(err); }

                    done();
                }
            );
        },

        /**
         * Show user settings.
         *
         * @param {Function} done
         * @param {Object} scope
         */
        enter: function(done, scope) {
            var semList, fak, i;

            /*
             * Indicate current semester selection.
             */
            semList = scope.content.find('.semList');
            semList.find('.active').removeClass('active');
            semList.find('li[data-target='+MS.user.current.semester+']').trigger('touchend');

            /*
             * Use temporary course list to store changes before saving them
             */
            MS.page.introcourses.tempCourseList = [];
            for (i=MS.user.current.courses.length; i--;) {
                MS.page.introcourses.tempCourseList.push(MS.user.current.courses[i]+'');
            }

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

            semList = scope.content.find('.semList');

            semList
                .removeClass('w'+semList.attr('data-w'))
                .removeClass('fak'+semList.attr('data-fak'))
                .addClass('w'+(count+1))
                .addClass('fak'+facultyId)
                .attr('data-w', (count+1))
                .attr('data-fak', facultyId);

            template = '<li data-target="{{i}}">{{i}}</li>';

            semList.empty();
            for (;count--;) {
                semList.prepend(Mustache.render(template, {i:count+1}));
            }

            semList.prepend(Mustache.render(template, {i:0, key: 'e'}));
        },

        /**
         * Inserts the course list dynamically into the content body.
         *
         * @param {Object} scope
         * @param {Array} courses
         */
        drawCourseList: function drawCourseList(scope, courses) {
            var courseList, template, i;

            courseList = scope.content.find('ul.courseList');

            template = '<li class="fach" data-id="{{c.fach_id}}">' +
                '<p class="small">' +
                '<img class="fl open" src="asset/icon/iconmoon-bbb9bc/arrow-up.png">' +
                '<img class="fl close" src="asset/icon/iconmoon-434144/arrow-down.png">' +
                '</p>' +
                '<p>{{c.name}}</p>' +
                '</li>';

            courseList.empty();
            for (i=courses.length; i--;) {
                courseList.prepend(Mustache.render(template, {c: courses[i]}));
            }
        },

        /**
         * Inserts the lecture list dynamically.
         *
         * @param {Object} $listItem
         * @param {number|String} lectures
         */
        drawLectures: function drawLectures($listItem, lectures) {
            var template, i, time;

            time = moment();
            for (i=lectures.length; i--;) {
                lectures[i].weekdayName = time.day((lectures[i].weekday+1)%7).format('dddd');
                lectures[i].on = MS.page.introcourses.tempCourseList.indexOf(lectures[i].id+'') !== -1;
            }

            template = '<li class="lectures"><table>{{#lectures}}' +
                '<tr class="{{#on}}on{{/on}}{{^on}}off{{/on}}" data-id="{{id}}">' +
                    '<td>' +
                        '<img class="on" src="./asset/icon/iconmoon-bbb9bc/checkbox-checked.png">' +
                        '<img class="off" src="./asset/icon/iconmoon-434144/checkbox-unchecked.png">' +
                    '</td>' +
                    '<td class="label"><span class="studygroup">{{studiengruppe_name}}</span> Jeden {{weekdayName}} {{start}}-{{end}}, {{raum}} bei {{dozent}}</td>' +
                '</tr>' +
                '{{/lectures}}</table></li>';

            $listItem.after(Mustache.render(template, {lectures:lectures}));
        }
    };

})();