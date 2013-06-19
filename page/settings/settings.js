window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.settings = {

        /**
         * Gets the required data for the form inputs. Binds event handlers,
         * add view functionality and manage view hacks (be aware of the native
         * keyboard).
         * Will be called once.
         * ToDo save only by click on the save button.
         *
         * @param {Function} done
         * @param {Object} scope
         */
        init: function(done, scope) {
            var list, itemTemplate;

            itemTemplate = '<option value={{id}}>{{name}}</option>';

            Step(
                /*
                 * Get and draw faculties from database.
                 */
                function drawFaculties() {
                    var i, l, self;

                    self = this;
                    list = scope.view.find('#changeFaculty');

                    MS.courses.getFaculties(function(err, result) {

                        list.empty();
                        for (i=0, l=result.length; i<l; i++) {
                            list.append(Mustache.render(itemTemplate, result[i]));
                        }

                        // Show the current users setting
                        MS.shim.select.showSelectItem(list,
                            MS.user.current.faculties[0]);

                        self();
                    });
                },

                /*
                 * Get and draw studies from database, based on
                 * the current users settings.
                 */
                function drawStudies(err) {
                    if (err) { console.log(err); }

                    MS.page.settings.drawStudies(
                        scope,
                        MS.user.current.faculties[0],
                        this);
                },

                /*
                 * Get and draw studygroups from database, based on
                 * the current users settings.
                 */
                function drawStudygroups(err) {
                    if (err) { console.log(err); }

                    MS.page.settings.drawStudygroups(
                        scope,
                        MS.user.current.studiengang_id,
                        MS.user.current.semester,
                        this);
                },

                /*
                 * UI Handler, switch between faculties.
                 */
                function facultyHandler(err) {
                    if (err) { console.log(err); }

                    list = scope.view.find('#changeFaculty');
                    list.on('change', function() {
                        var self = $(this),
                            fak = self.val(),
                            text = self.find(':selected').text(),
                            semList = scope.view.find('.semList'),
                            sem = semList.find('.active').attr('data-target'),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);

                        /*
                         * Update semester list.
                         */
                        MS.courses.getMaxSemesterCount(fak, function(err, count) {
                            if (err) {
                                return console.log(err);
                            }
                            MS.page.settings.drawSemList(scope, fak, count);

                            /*
                             * Stay at the old sem value or set
                             * semester to the current users setting.
                             */
                            if (!sem) {
                                sem = MS.user.current.semester;
                            }

                            semList
                                .find('li[data-target='+sem+']')
                                .addClass('active');

                            /*
                             * Update studies and studygroups.
                             */
                            MS.page.settings.drawStudies(scope, fak, function() {
                                var studyId, sem;

                                studyId = scope.view.find('#changeStudy').val();
                                sem = semList.find('.active').attr('data-target');
                                if (!sem) {
                                    sem = MS.user.current.semester;
                                }

                                MS.page.settings.drawStudygroups(scope, studyId, sem);
                            });
                            return true;
                        });
                    });
                    return true;
                },

                /*
                 * UI Handler, switch between studies.
                 */
                function studyHandler(err) {
                    if (err) { console.log(err); }

                    list = scope.view.find('#changeStudy');
                    list.on('change', function() {
                        var self = $(this),
                            studyId = self.val(),
                            sem = scope.view.find('.semList').find('.active').attr('data-target'),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);

                        if (!sem) {
                            sem = MS.user.current.semester;
                        }

                        MS.page.settings.drawStudygroups(scope, studyId, sem);
                    });
                    return true;
                },

                /*
                 * UI Handler, switch between semester.
                 */
                function semListHandler(err) {
                    if (err) { console.log(err); }

                    scope.view.find('.semList').on('touchend', 'li', function() {
                        var self = $(this),
                            studyId = scope.view.find('#changeStudy').val(),
                            sem = $(this).attr('data-target');

                        self.parent().find('.active').removeClass('active');
                        self.addClass('active');

                        MS.page.settings.drawStudygroups(scope, studyId, sem);
                    });
                    return true;
                },

                /*
                 * UI Handler, switch between studygroups.
                 */
                function studygroupHandler(err) {
                    if (err) { console.log(err); }

                    list = scope.view.find('#changeStudygroup');
                    list.on('change', function() {
                        var self = $(this),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);
                    });
                    return true;
                },

                /*
                 * UI Handler, toggle theme.
                 */
                function toggleThemeHandler(err) {
                    if (err) { console.log(err); }

                    /*
                     * Switch Theme button. Replaces css with a new theme file.
                     */
                    scope.view.find('#changeTheme').on('change', function() {
                        var checked = $(this).is(':checked'),
                            oldLink, newLink;

                        oldLink = document.getElementById("theme");
                        newLink = document.createElement("link");
                        newLink.setAttribute("rel", "stylesheet");
                        newLink.setAttribute("type", "text/css");
                        newLink.setAttribute("id", "theme");
                        newLink.setAttribute("href", './style/style'+(checked?'_light':'')+'.css');
                        document.getElementsByTagName("head").item(0).replaceChild(newLink, oldLink);
                    });
                    return true;
                },

                /*
                 * UI Handler, save user settings on toggle buttons change.
                 */
                function toggleButtonHandler(err) {
                    if (err) { console.log(err); }

                    scope.view.on('change', '.onoffswitch-checkbox', function() {
                        var self = $(this),
                            checked = self.is(':checked')? 1 : 0,
                            fieldMap = {
                                'changePush': 'isPush',
                                'changeSync': 'isSync',
                                'changeBackup': 'isBackup',
                                'changeTheme': 'isLightTheme'
                            },
                            field = fieldMap[self.attr('id')];

                        MS.db.set('user',
                            [field],
                            [checked],
                            'id="'+MS.user.current.id+'"',
                            function(err) {
                                if (err) {
                                    console.log(err);
                                }

                                MS.user.update();
                            });
                    });
                    return true;
                },

                /*
                 * Finished, go to the next phase.
                 */
                function finishLoad(err) {
                    if (err) { console.log(err); }

                    done();
                }
            );

            /*
             * Hack, hide / show footer to prevent bugged position:absolute.
             */
            document.addEventListener("showkeyboard", function() {
                MS.dom.footer.hide();
            }, false);

            document.addEventListener("hidekeyboard", function() {
                setTimeout(function() {
                    MS.dom.footer.show();
                }, 200);
            }, false);


        },

        /**
         * Basically just updates the settings view to
         * match the current users setting on enter.
         *
         * @param {Function} done
         * @param {Object} scope
         */
        enter: function(done, scope) {
            var user;
            
            user = MS.user.current;

            if (user) {
                scope.view.find('#changePush').attr('checked', !!user.isPush);
                scope.view.find('#changeSync').attr('checked', !!user.isSync);
                scope.view.find('#changeBackup').attr('checked', !!user.isBackup);
                scope.view.find('#changeTheme').attr('checked', !!user.isLightTheme);

                MS.courses.getMaxSemesterCount(user.faculties[0], function(err, count) {
                    MS.page.settings.drawSemList(scope, user.faculties[0], count);

                    // Select current users semester
                    scope.view.find('.semList').find('li[data-target='+user.semester+']').addClass('active');
                });
            }

            done();
        },

        /**
         * Do nothing yet.
         */
        leave: function leave() {},

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

            MS.courses.getStudygroupsBySem(studyId, sem,
                function(err, groups) {
                    if (err) {
                        return console.log(err);
                    }

                    var list, i;

                    list = scope.view.find('#changeStudygroup');
                    list.empty();

                    for (i=groups.length; i--;) {
                        list.append(Mustache.render(itemTemplate, groups[i]));
                    }

                    MS.shim.select.showSelectItem(
                        scope.view.find('#changeStudygroup'),
                        MS.user.current.studiengruppe_id);

                    return callback(undefined, groups);
                });
        },

        /**
         * Inserts study list into the DOM.
         *
         * @param {Object} scope
         * @param {number} facultyId
         * @param {Function} [callback]
         */
        drawStudies: function drawStudies(scope, facultyId, callback) {
            var itemTemplate;

            itemTemplate = '<option value={{id}}>{{name}}</option>';
            callback = callback || function() {};

            MS.courses.getStudies(facultyId,
                function(err, studies) {
                    if (err) {
                        return callback(err);
                    }

                    var list, i;

                    list = scope.view.find('#changeStudy');
                    list.empty();

                    for (i=studies.length; i--;) {
                        list.append(Mustache.render(itemTemplate, studies[i]));
                    }

                    MS.shim.select.showSelectItem(
                        scope.view.find('#changeStudy'),
                        MS.user.current.studiengang_id);

                    return callback(undefined, studies);
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
            var semList,
                template;

            semList = scope.view.find('.semList');

            semList
                .removeClass('w'+semList.attr('data-w'))
                .removeClass('fak'+semList.attr('data-fak'))
                .addClass('w'+count)
                .addClass('fak'+facultyId)
                .attr('data-w', count)
                .attr('data-fak', facultyId)
                .empty();

            template = '<li data-target="{{i}}">{{i}}</li>';

            for (;count--;) {
                semList.prepend(Mustache.render(template, {i:count+1}));
            }
        }
    };

})();