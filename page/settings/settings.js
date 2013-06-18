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
         * @param scope
         */
        init: function(scope) {
            var list, itemTemplate;

            itemTemplate = '<option value={{id}}>{{name}}</option>'; // ToDo, save templates in files

            /*
             * Get and insert faculties from database.
             */
            list = scope.view.find('#changeFaculty');
            list.empty();
            MS.db.get(
                'SELECT id, name FROM fakultaet',
                function(err, result) {
                    var i, l;
                    for (i=0, l=result.length; i<l; i++) {
                        list.append(Mustache.render(itemTemplate, result[i]));
                    }
                }
            );

            /*
             * Switch between faculties.
             */
            list.on('change', function() {
                var self = $(this),
                    fak = self.val(),
                    list = scope.view.find('.semList'),
                    text = self.find(':selected').text(),
                    valueField = self.parent().find('.selectContent');

                list.removeClass('fak'+list.attr('data-fak'))
                    .attr('data-fak', fak)
                    .addClass('fak'+list.attr('data-fak'), fak);

                valueField.html(text);
            });

            /*
             * Hide / Show footer to prevent bugged position:absolute.
             */
            document.addEventListener("showkeyboard", function() {
                MS.dom.footer.hide();
            }, false);

            document.addEventListener("hidekeyboard", function() {
                setTimeout(function() {
                    MS.dom.footer.show();
                }, 200);
            }, false);

            /*
             * Replace css with a new theme file.
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

            /*
             * Update current user settings
             */
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
        },

        /**
         * Basically just updates the settingsview to match the current user.
         *
         * @param done
         * @param scope
         */
        enter: function(done, scope) {

            /*
             * Display current user settings.
             */
            if (MS.user.current) {
                scope.view.find('#changePush').attr('checked', !!MS.user.current.isPush);
                scope.view.find('#changeSync').attr('checked', !!MS.user.current.isSync);
                scope.view.find('#changeBackup').attr('checked', !!MS.user.current.isBackup);
                scope.view.find('#changeTheme').attr('checked', !!MS.user.current.isLightTheme);
            }

            done();
        },

        /**
         * Do nothing yet.
         */
        leave: function leave() {}
    };

})();