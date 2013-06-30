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
                    list = scope.content.find('#changeFaculty');

                    MS.courses.getFaculties(function(err, result) {
                        if (err) {
                            return self(err);
                        }

                        list.empty();
                        for (i=0, l=result.length; i<l; i++) {
                            list.append(Mustache.render(itemTemplate, result[i]));
                        }

                        // Show the current users setting
                        MS.shim.select.showSelectItem(list,
                            MS.user.current.faculties[0]);

                        return self();
                    });
                },

                /*
                 * Get and draw studies from database, based on
                 * the current users settings.
                 */
                function drawStudies(err) {
                    if (err) { throw err; }

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
                    if (err) { throw err; }

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
                    if (err) { throw err; }

                    list = scope.content.find('#changeFaculty');
                    list.on('change', function() {
                        var self = $(this),
                            fak = self.val(),
                            text = self.find(':selected').text(),
                            semList = scope.content.find('.semList'),
                            sem = semList.find('.active').attr('data-target'),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);

                        /*
                         * Update semester list.
                         */
                        MS.courses.getMaxSemesterCount(fak, function(err, count) {
                            if (err) {
                                MS.tools.toast.long(err);
                                return;
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

                                studyId = scope.content.find('#changeStudy').val();
                                sem = semList.find('.active').attr('data-target');
                                if (!sem) {
                                    sem = MS.user.current.semester;
                                }

                                MS.page.settings.drawStudygroups(scope, studyId, sem);
                            });
                        });
                    });
                    return true;
                },

                /*
                 * UI Handler, switch between faculties.
                 */
                function calHandler(err) {
                    if (err) { throw err; }

                    list = scope.content.find('.changeCal');
                    list.on('change', function() {
                        var self = $(this),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);
                    });
                    return true;
                },

                /*
                 * UI Handler, switch between studies.
                 */
                function studyHandler(err) {
                    if (err) { throw err; }

                    list = scope.content.find('#changeStudy');
                    list.on('change', function() {
                        var self = $(this),
                            studyId = self.val(),
                            sem = scope.content.find('.semList').find('.active').attr('data-target'),
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
                    if (err) { throw err; }

                    scope.content.find('.semList').on('touchend', 'li', function() {
                        var self = $(this),
                            studyId = scope.content.find('#changeStudy').val(),
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
                    if (err) { throw err; }

                    list = scope.content.find('#changeStudygroup');
                    list.on('change', function() {
                        var self = $(this),
                            text = self.find(':selected').text(),
                            valueField = self.parent().find('.selectContent');

                        valueField.html(text);
                    });
                    return true;
                },

                /*
                 * UI Handler, toggle calendar list.
                 */
                function calCheckboxHandler(err) {
                    if (err) { throw err; }

                    var checkbox, checked;

                    checkbox = scope.content.find('#changeSync');

                    checkbox.on('change', function() {
                        checked = $(this).is(':checked');

                        if (checked) {
                            MS.page.settings.drawCalList(scope, function(err, list) {
                                MS.shim.select.showSelectItem(list, 0);
                            });
                        } else {
                            MS.page.settings.disableCalList(scope);
                        }
                    });

                    return true;
                },

                /*
                 * UI Handler, updates the current users password and studygroup.
                 */
                function saveButtonHandler(err) {
                    if (err) { throw err; }

                    scope.footer.find('.button.by').on('touchend', function() {
                        MS.page.settings.savePassword(scope);
                        MS.page.settings.saveStudygroup(scope);

                        var toggleButtons = scope.content.find('.onoffswitch-checkbox'),
                            fieldMap = {
                                'changePush': 'isPush',
                                'changeSync': 'isSync',
                                'changeBackup': 'isBackup',
                                'changeTheme': 'isLightTheme'
                            };

                        toggleButtons.each(function(key, obj) {
                            var self = $(obj),
                                checked = self.is(':checked')? 1 : 0,
                                field = fieldMap[$(this).attr('id')],
                                calId;

                            MS.user.setSetting(field, checked);

                            if (field === 'isLightTheme') {
                                MS.theme.set(checked);
                            }
                            if (field === 'isSync') {
                                calId = scope.content.find('.changeCal').val();
                                MS.user.setSetting('cal_id', calId);

                                if (checked) {
                                    MS.calendar.synchronizeWith(calId);
                                }
                            }
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
                        MS.page.settings.enter(function() {
                            MS.tools.toast.short('Änderungen verworfen');
                        }, scope);
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
            scope.header.on('touchstart', '.mheader', function() {
                $(this).addClass('touch');
            });
            scope.content.on('touchstart', '.onoffswitch', function() {
                $(this).addClass('touch');
            });
            scope.footer.on('touchstart', '.button', function() {
                $(this).addClass('touch');
            });

            /*
             * Hack, hide / show footer to prevent bugged position:absolute.
             */
            document.addEventListener("showkeyboard", function() {
                if (MS.dom.wrapper.attr('data-page') === 'settings') {
                    MS.dom.footer.hide();
                }
            }, false);

            document.addEventListener("hidekeyboard", function() {
                if (MS.dom.wrapper.attr('data-page') === 'settings') {
                    setTimeout(function() {
                            MS.dom.footer.show();
                    }, 200);
                }
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

            scope.content.find('.changeOldPw').val('');
            scope.content.find('.changeNewPw').val('');
            scope.content.find('.changeNewPwSec').val('');

            if (user) {
                scope.content.find('#changePush').prop('checked', !!user.isSync);
                scope.content.find('#changeBackup').prop('checked', !!user.isBackup);
                scope.content.find('#changeTheme').prop('checked', !!user.isLightTheme);

                if (!!user.isSync) {
                    scope.content.find('#changeSync').prop('checked', true);
                    MS.page.settings.drawCalList(scope, function(err, list) {
                        MS.shim.select.showSelectItem(list, user.cal_id || 0);
                    });

                } else {
                    scope.content.find('#changeSync').prop('checked', false);
                    MS.page.settings.disableCalList(scope);
                }

                MS.courses.getMaxSemesterCount(user.faculties[0], function(err, count) {
                    MS.page.settings.drawSemList(scope, user.faculties[0], count);

                    // Select current users semester
                    scope.content.find('.semList').find('li[data-target='+user.semester+']').addClass('active');
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

            MS.courses.getStudygroupsBySem(studyId, sem, function(err, groups) {
                if (err) {
                    MS.tools.toast.long(err);
                    return;
                }

                var list, i;

                list = scope.content.find('.changeStudygroup');
                list.empty();

                for (i=groups.length; i--;) {
                    list.append(Mustache.render(itemTemplate, groups[i]));
                }

                MS.shim.select.showSelectItem(
                    list,
                    MS.user.current.studiengruppe_id);

                callback(undefined, groups);
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

                    list = scope.content.find('#changeStudy');
                    list.empty();

                    for (i=studies.length; i--;) {
                        list.append(Mustache.render(itemTemplate, studies[i]));
                    }

                    MS.shim.select.showSelectItem(
                        scope.content.find('#changeStudy'),
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

            semList = scope.content.find('.semList');

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
        },

        /**
         *
         *
         * @param {Object} scope
         * @param {Function} [callback]
         */
        drawCalList: function drawCalList(scope, callback) {
            callback = callback || function() {};

            var list, id, template;

            list = scope.content.find('.changeCal');
            template = '<option value={{id}}>{{name}}</option>';

            list.empty();
            list.parent().removeClass('disabled');

            MS.calendar.getCalendars(function(err, data) {
                if (err) {
                    callback(err);
                    return;
                }

                for (id in data) {
                    if (data.hasOwnProperty(id)) {
                        list.append(Mustache.render(template, {
                            id: id,
                            name: data[id]
                        }));
                    }
                }

                callback(undefined, list);
            });
        },

        /**
         *
         *
         * @param scope
         */
        disableCalList: function disableCalList(scope) {
            var list;

            list = scope.content.find('.changeCal');

            list.empty()
                .parent().addClass('disabled');
        },

        /**
         * Validates the form data of password input fields
         * and updates the current users password.
         *
         * @param {Object} scope
         */
        savePassword: function savePassword(scope) {
            var $oldPw = scope.content.find('.changeOldPw'),
                oldPw = $oldPw.val();

            if (!oldPw) {
                return;
            }

            var $newPw = scope.content.find('.changeNewPw'),
                $newPwSec = scope.content.find('.changeNewPwSec'),
                newPw = $newPw.val(),
                newPwSec = $newPwSec.val();

            if (newPw !== newPwSec) {
                MS.tools.toast.short('Passwörter stimmen nicht überein');
                return;
            }

            MS.user.authenticate(MS.user.current.email, oldPw, function(err, data) {
                if (data.length === 0) {
                    MS.tools.toast.short('Altes Passwort ungültig');
                    return;
                }

                if (!newPw) {
                    MS.tools.toast.shprt('Bitte neues Passwort eingeben');
                    return;
                }

                MS.user.setSetting('password', md5(newPw), function() {
                    MS.tools.toast.long('Passwort erfolgreich geändert');

                    $oldPw.val('');
                    $newPw.val('');
                    $newPwSec.val('');
                });
            });
        },

        /**
         *
         *
         * @param scope
         */
        saveStudygroup: function saveStudygroup(scope) {
            var $studyg = scope.content.find('.changeStudygroup'),
                studygId = $studyg.val();

            if (studygId === null) {
                return;
            }

            MS.user.setSetting('studiengruppe_id', studygId, function() {
                MS.user.updateData(function(err) {
                    if (err) {
                        MS.tools.toast.short(err);
                    }

                    MS.tools.toast.long('Einstellungen erfolgreich gespeichert');
                });
            });

        }

    };

})();