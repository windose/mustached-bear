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
            scope.content.on('touchstart', 'label, .footer span', function() {
                $(this).addClass('touch');
            });
            scope.content.on('touchmove', 'label', function() {
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
                            sem = semList.find('.active').attr('data-target');

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
                             * Get and insert the corresponding courses.
                             */
                            MS.courses.getCoursesBySem(fak, sem,
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
                                    MS.tools.toast.short(err.message);
                                    return;
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
                    if (err) { MS.tools.toast.short(err); }

                    scope.content.on('touchend', 'li', function() {
                        if (MS.isMove) { return; }

                        var self = $(this),
                            id = self.attr('data-id'),
                            index;

                        if (self.hasClass('on')) {
                            self.removeClass('on').addClass('off');
                            index = MS.page.courses.tempCourseList.indexOf(id);
                            if (index !== -1) {
                                MS.page.courses.tempCourseList.splice(index, 1);
                            }
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

                            MS.tools.toast.long('Kursliste erfolgreich gespeichert');
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
            semList = scope.header.find('.semList');
            semList.find('.active').removeClass('active');
            semList.find('li[data-target='+MS.user.current.semester+']').addClass('active');

            fak = scope.header.find('select').val();
            if (!fak) {
                fak = MS.user.current.faculties[0];
            }

            MS.courses.getCoursesBySem(fak, MS.user.current.semester,
                function(err, courses) {
                    if (err) {
                        MS.tools.toast.long(err.message);
                        return;
                    }
                    MS.page.courses.drawCourseList(scope, courses);
                });

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
            var courseList, template, i;

            courseList = scope.content.find('ul');

            template = '<li class="{{#on}}on{{/on}}{{^on}}off{{/on}}" data-id="{{c.id}}"><label class="cf"><table><tr>'+
                '<td><img class="on" src="./asset/icon/iconmoon-bbb9bc/checkbox-checked.png"><img class="off" src="./asset/icon/iconmoon-bbb9bc/checkbox-unchecked.png"></td>' +
                '<td class="label">{{c.name}}<br>Jeden {{weekday}} {{c.start}}-{{c.end}}, {{c.raum}} bei {{c.dozent}}</td>' +
                '</tr></table></label></li>';

            courseList.empty();
            for (i=courses.length; i--;) {
                courseList.prepend(Mustache.render(template, {
                    weekday: MS.timeline.weekdays[courses[i].weekday],
                    c: courses[i],
                    on: MS.page.courses.tempCourseList.indexOf(courses[i].id+'') !== -1
                }));
            }
        }
    };

})();