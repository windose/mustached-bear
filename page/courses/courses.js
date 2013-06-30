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
                            MS.tools.toast.short(err.message);
                            return
                        }

                        MS.page.courses.drawSemList(scope, MS.user.current.faculties[0], count);
                        self();
                    });
                },

                /*
                 * UI Handler, switch between faculty.
                 */
                function facultyHandler(err) {
                    if (err) { MS.tools.toast.short(err); }

                    scope.header.find('select').on('change', function() {
                        var self = $(this),
                            fak = self.val(),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent'),
                            semList = scope.header.find('.semList'),
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
                            MS.page.courses.drawSemList(scope, fak, count);

                            /*
                             * Show only the current users studygroup entries
                             * in his semester.x
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
                    if (err) { MS.tools.toast.short(err); }

                    scope.header.find('.semList').on('touchend', 'li', function() {
                        var self = $(this),
                            fak = scope.header.find('select').val(),
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
                                MS.page.courses.drawCourseList(scope, courses);
                            });
                    });

                    return true;
                },

                /*
                 * UI Handler, open lecture list.
                 */
                function lectureHandler(err) {
                    if (err) { MS.tools.toast.short(err); }

                    scope.content.on('touchend', 'li.fach', function() {
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

                        semList = scope.header.find('.semList');
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

                            MS.page.courses.drawLectures(self, data);
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

                    scope.content.on('touchend', 'tr', function() {
                        if (MS.isMove) { return; }
                        var self, id;

                        self = $(this);
                        id = self.attr('data-id');

                        if (self.hasClass('on')) {
                            self.removeClass('on').addClass('off');

                            MS.page.courses.tempCourseList.splice(MS.page.courses.tempCourseList.indexOf(id), 1);
                        } else {
                            self.removeClass('off').addClass('on');

                            MS.page.courses.tempCourseList.push(id);
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
                        MS.user.setCourses(MS.page.courses.tempCourseList, function(err) {
                            if (err) {
                                MS.tools.toast.short(err);
                                return;
                            }

                            // Update Calendar
                            if (MS.user.current.isSync) {
                                MS.calendar.synchronizeWith(MS.user.current.cal_id);
                            }

                            MS.tools.toast.long('Kursliste erfolgreich gespeichert');
                        });
                    });

                    return true;
                },

                /*
                 * UI Handler, resets the current users course list via <enter>.
                 */
                function resetButtonHandler(err) {
                    if (err) { throw err; }

                    scope.footer.find('.button.bn').on('touchend', function() {
                        MS.page.courses.enter(function() {
                            MS.tools.toast.short('Änderungen verworfen');
                        }, scope);
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
            semList = scope.header.find('.semList');
            semList.find('.active').removeClass('active');
            semList.find('li[data-target='+MS.user.current.semester+']').trigger('touchend');

            /*
             * Use temporary course list to store changes before saving them
             */
            MS.page.courses.tempCourseList = [];
            for (i=MS.user.current.courses.length; i--;) {
                MS.page.courses.tempCourseList.push(MS.user.current.courses[i]+'');
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

            semList = scope.header.find('.semList');

            semList
                .removeClass('w'+semList.attr('data-w'))
                .removeClass('fak'+semList.attr('data-fak'))
                .addClass('w'+(count+1))
                .addClass('fak'+facultyId)
                .attr('data-w', (count+1))
                .attr('data-fak', facultyId);

            template = '<li data-target="{{i}}">{{key}}</li>';

            semList.empty();
            for (;count--;) {
                semList.prepend(Mustache.render(template, {i:count+1, key:count+1}));
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

            courseList = scope.content.find('ul');

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
                lectures[i].on = MS.page.courses.tempCourseList.indexOf(lectures[i].id+'') !== -1;
                lectures[i].isOwnStudygroup = lectures[i].studiengruppe_name === MS.user.current.studiengruppe_name;
            }

            template = '<li class="lectures"><table>{{#lectures}}' +
                '<tr class="{{#on}}on{{/on}}{{^on}}off{{/on}}" data-id="{{id}}">' +
                    '<td>' +
                        '<img class="on" src="./asset/icon/iconmoon-bbb9bc/checkbox-checked.png">' +
                        '<img class="off" src="./asset/icon/iconmoon-434144/checkbox-unchecked.png">' +
                    '</td>' +
                    '<td class="label">{{^isOwnStudygroup}}<span class="studygroup">{{studiengruppe_name}}</span> {{/isOwnStudygroup}}' +
                        'Jeden {{weekdayName}} {{start}}-{{end}}, {{raum}} bei {{dozent}}</td>' +
                '</tr>' +
                '{{/lectures}}</table></li>';

            $listItem.after(Mustache.render(template, {lectures:lectures}));
        }
    };

})();