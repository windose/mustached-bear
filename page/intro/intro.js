window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.intro = {

        /**
         *
         * @param done
         * @param scope
         */
        init: function(done, scope) {

            Step(
                /*
                 * Get and draw faculties.
                 */
                function drawFaculties() {
                    var self = this;
                    MS.page.intro.drawFaculties(scope, function(err, list) {
                        MS.shim.select.showSelectItem(list, 0);
                        self();
                    });
                },

                /*
                 * Draws the semester list.
                 */
                function drawSemList() {
                    var fak, self;

                    self = this;
                    fak = scope.overlay.find('.formFaculty').val();

                    MS.courses.getMaxSemesterCount(fak, function(err, count) {
                        MS.page.intro.drawSemList(scope, fak, count);
                        scope.overlay.find('.semList').find('li[data-target=1]').addClass('active');
                        self();
                    });
                },

                /*
                 * Get and draw studies from database.
                 */
                function drawStudies() {
                    var fak, self;

                    self = this;
                    fak = scope.overlay.find('.formFaculty').val();

                    MS.page.intro.drawStudies(scope, fak, function(err, list) {
                        MS.shim.select.showSelectItem(list, 0);
                        self();
                    });
                },

                /*
                 * Get and draw studygroups from database.
                 */
                function drawStudygroups() {
                    var study, self;

                    self = this;
                    study = scope.overlay.find('.formStudy').val();

                    MS.page.intro.drawStudygroups(scope, study, 1, function(err, list) {
                        MS.shim.select.showSelectItem(list, 0);
                        self();
                    });
                },

                /*
                 * UI Handler, switch between faculties.
                 */
                function facultyHandler(err) {
                    if (err) { throw err; }

                    var list = scope.overlay.find('.formFaculty');
                    list.on('change', function() {
                        var self = $(this),
                            fak = self.val(),
                            text = self.find(':selected').text(),
                            semList = scope.overlay.find('.semList'),
                            sem = semList.find('.active').attr('data-target'),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);

                        if (!sem) { sem = 1; }

                        Step(
                            function getMaxSemesterCount() {
                                MS.courses.getMaxSemesterCount(fak, this);
                            },

                            function updateSemList(err, count) {
                                MS.page.intro.drawSemList(scope, fak, count);

                                semList
                                    .find('li[data-target='+sem+']')
                                    .addClass('active');

                                MS.page.intro.drawStudies(scope, fak, this);
                            },

                            function updateStudygroup(err, list) {
                                MS.shim.select.showSelectItem(list, 0);

                                var studyId;

                                studyId = scope.overlay.find('.formStudy').val();

                                MS.page.intro.drawStudygroups(scope, studyId, sem, this);
                            },

                            function (err, list) {
                                MS.shim.select.showSelectItem(list, 0);
                            }
                        );

                    });
                    return true;
                },

                /*
                 * UI Handler, switch between studies.
                 */
                function studyHandler() {
                    var list;

                    list = scope.overlay.find('.formStudy');
                    list.on('change', function() {
                        var self = $(this),
                            studyId = self.val(),
                            sem = scope.overlay.find('.semList').find('.active').attr('data-target'),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);

                        if (!sem) { sem = 1; }

                        MS.page.intro.drawStudygroups(scope, studyId, sem, function(err, list) {
                            MS.shim.select.showSelectItem(list, 0);
                        });
                    });
                    return true;
                },

                /*
                 * UI Handler, switch between semester.
                 */
                function semListHandler() {
                    scope.overlay.find('.semList').on('touchend', 'li', function() {
                        var self = $(this),
                            studyId = scope.overlay.find('.formStudy').val(),
                            sem = self.attr('data-target');

                        self.parent().find('.active').removeClass('active');
                        self.addClass('active');

                        MS.page.intro.drawStudygroups(scope, studyId, sem, function(err, list) {
                            MS.shim.select.showSelectItem(list, 0);
                        });
                    });
                    return true;
                },

                /*
                 * UI Handler, switch between studygroups.
                 */
                function studygroupHandler() {
                    var list;

                    list = scope.overlay.find('.formStudygroup');
                    list.on('change', function() {
                        var self = $(this),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);
                    });
                    return true;
                },

                /*
                 * UI Handler, performs the action for the submit registration button.
                 */
                function submitButtonHandler() {
                    scope.overlay.find('.button').on('touchend', function() {
                        MS.page.intro.manageSubmit(scope);
                    });

                    return true;
                },

                /*
                 * Finished, go to the next phase.
                 */
                function finishLoad(err) {
                    if (err) {
                        MS.tools.toast.long(err);
                    }

                    done();
                }
            );

            /*
             * Touch highlighting.
             */
            scope.overlay.on('touchstart', '.button', function() {
                $(this).addClass('touch');
            });

            scope.overlay.find('select').hide();
        },

        /**
         *
         * @param done
         * @param scope
         */
        enter: function(done, scope) {

            // Blackout the content body to prevent tearing effects
            MS.dom.body.addClass('bo');

            setTimeout(function() {
                scope.overlay.find('select').show();
            }, 200);

            done();

        },

        /**
         *
         */
        leave: function() {
            MS.dom.body.removeClass('bo');
        },

        /**
         *
         * @param {Object} scope
         * @param {Function} [callback]
         */
        drawFaculties: function drawFaculties(scope, callback) {
            var i, l, list, template;

            callback = callback || function() {};
            list = $.fn.add.call(
                scope.overlay.find('.formFaculty'),
                scope.content.find('.formFaculty'));
            template = '<option value={{id}}>{{name}}</option>';

            if (list.length === 0) {
                callback('No element found to insert faculties into');
                return;
            }

            MS.courses.getFaculties(function(err, result) {
                if (err) {
                    callback(err);
                    return;
                }

                list.empty();
                for (i=0, l=result.length; i<l; i++) {
                    list.append(Mustache.render(template, result[i]));
                }

                callback(undefined, list);
            });
        },

        /**
         * Inserts the semester list (for tab navigation) dynamically
         * into the header and manages the css classes.
         * Todo: merge with courses
         *
         * @param {Object} scope
         * @param {number} facultyId
         * @param {number} count
         */
        drawSemList: function drawSemList(scope, facultyId, count) {
            var list,
                template;

            list = $.fn.add.call(
                scope.overlay.find('.semList'),
                scope.content.find('.semList'));

            list.removeClass('w'+list.attr('data-w'))
                .removeClass('fak'+list.attr('data-fak'))
                .addClass('w'+count)
                .addClass('fak'+facultyId)
                .attr('data-w', count)
                .attr('data-fak', facultyId)
                .empty();

            template = '<li data-target="{{i}}">{{i}}</li>';

            for (;count--;) {
                list.prepend(Mustache.render(template, {i:count+1}));
            }
        },

        /**
         * Inserts study list into the DOM.
         *
         * @param {Object} scope
         * @param {number} facultyId
         * @param {Function} [callback]
         */
        drawStudies: function drawStudies(scope, facultyId, callback) {
            var template;

            template = '<option value={{id}}>{{name}}</option>';
            callback = callback || function() {};

            MS.courses.getStudies(facultyId, function(err, studies) {
                if (err) {
                    callback(err);
                    return;
                }

                var list, i;

                list = $.fn.add.call(
                    scope.overlay.find('.formStudy'),
                    scope.content.find('.formStudy'));
                list.empty();

                for (i=studies.length; i--;) {
                    list.append(Mustache.render(template, studies[i]));
                }

                callback(undefined, list);
            });
        },

        /**
         * Inserts studygroups into the DOM.
         *
         * @param {Object} scope
         * @param {number} studyId
         * @param {number} sem
         * @param {Function} [callback]
         */
        drawStudygroups: function drawStudygroups(scope, studyId, sem, callback) {
            var itemTemplate;

            itemTemplate = '<option value={{id}}>{{name}}</option>';
            callback = callback || function() {};

            MS.courses.getStudygroupsBySem(studyId, sem, function(err, groups) {
                if (err) {
                    callback(err);
                    return;
                }

                var list, i;

                list = $.fn.add.call(
                    scope.overlay.find('.formStudygroup'),
                    scope.content.find('.formStudygroup'));
                list.empty();

                for (i=groups.length; i--;) {
                    list.append(Mustache.render(itemTemplate, groups[i]));
                }

                callback(undefined, list);
            });
        },

        /**
         *
         * @param {Object} scope
         */
        manageSubmit: function manageSubmit(scope) {
            var $email = scope.overlay.find('.formEmail'),
                $pw = scope.overlay.find('.formPw'),
                $pwSec = scope.overlay.find('.formPwSec'),
                $semList = scope.overlay.find('.semList'),
                $studygroup = scope.overlay.find('.formStudygroup'),
                email = $email.val(),
                pw = $pw.val(),
                pwSec = $pwSec.val(),
                semList = $semList.find('.active').attr('data-target'),
                studygroup = $studygroup.val();

            /*
             * Validate input data.
             */
            if (email === '') {
                MS.tools.toast.short('Bitte E-Mail Adresse angeben');
                return;
            }
            if (!/^[a-zA-Z0-9\.]+@hm\.edu/.test(email)) {
                MS.tools.toast.long('E-Mail Adresse muss von der Hochschule München sein (@hm.edu)');
                return;
            }
            if (pw === '') {
                MS.tools.toast.short('Bitte Passwort eingeben');
                return;
            }
            if (pwSec === '') {
                MS.tools.toast.short('Bitte Passwort bestätigen');
                return;
            }
            if (pw !== pwSec) {
                MS.tools.toast.short('Passwörter stimmen nicht überein');
                return;
            }
            if (pw !== pwSec) {
                MS.tools.toast.short('Passwörter stimmen nicht überein');
                return;
            }
            if (!studygroup) {
                MS.tools.toast.short('Bitte Studiengruppe festlegen');
                return;
            }

            MS.user.create(email, pw, studygroup, function(err) {
                if (err) {
                    MS.tools.toast.short(err);
                    return;
                }

                MS.user.login(email, pw, function(err) {
                    if (err) {
                        MS.tools.toast.short(err);
                        return;
                    }

                    // Save userId for auto login
                    localStorage.setItem('user_id', MS.user.current.id);

                    // Go to the course page, for selecting the users first courses
                    MS.navigator.goTo('introcourses');
                });
            });
        }
    };

})();