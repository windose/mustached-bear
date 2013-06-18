window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.courses = {

        /**
         *
         *
         * @param header
         * @param view
         */
        init: function(scope) {

            /*
             * Touch highlighting
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
             * Switch between faculty
             */
            scope.header.find('select').on('change', function() {
                var self = $(this),
                    fak = self.val(),
                    text = self.find(':selected').text(),
                    valueField = self.parent().find('.selectContent');

                $.fn.add.call(scope.view,scope.header)
                    .removeClass('fak'+scope.view.attr('data-fak'))
                    .attr('data-fak', fak)
                    .addClass('fak'+scope.view.attr('data-fak'), fak);

                valueField.html(text);
            });

            /*
             * Switch between semester
             */
            scope.header.find('.semList').on('touchend', 'li', function() {
                var sem = $(this).attr('data-target');

                scope.view.removeClass('sem'+scope.view.attr('data-sem'))
                    .attr('data-sem', sem)
                    .addClass('sem'+scope.view.attr('data-sem'), sem);
            });

            /*
             * Toggle state of course on touch
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

            scope.header.on('touchstart', 'select', function() {
                console.log('touchstart');
            });
            scope.header.on('touchend', 'select', function() {
                console.log('touchend');
            });

        },

        /**
         *
         * @param done
         * @param header
         * @param view
         */
        enter: function(done, scope) {

            var fakList,
                fakTemplate;

            fakList = scope.header.find('select');
            fakTemplate = '<option value={{id}}>{{name}}</option>'; // ToDo, save templates in files

            /*
             * Get and insert faculties from database
             */
            fakList.empty();
            MS.db.get(
                'SELECT id, name FROM fakultaet',
                function(err, result) {
                    var i, l;
                    for (i=0, l=result.length; i<l; i++) {
                        fakList.append(Mustache.render(fakTemplate, result[i]));
                    }
                }
            );

            /*
             * Get and insert course list
             */
            scope.view.find('ul').empty();
            MS.page.courses.getCourseList(function(err, result) {
                var i, l;
                for (i=0, l=result.length; i<l; i++) {
                    MS.page.courses.insertCourse(scope.view, result[i]);
                }
                done();
            });

        },

        /**
         *
         */
        leave: function() {},

        /**
         *
         * @param view
         * @param data
         */
        insertCourse: function(view, data) {
            var template;

            template = '<li class="off"><label class="cf"><table><tr>'+
                '<td><img class="on" src="./asset/icon/iconmoon-bbb9bc/checkbox-checked.png"><img class="off" src="./asset/icon/iconmoon-bbb9bc/checkbox-unchecked.png"></td>'+
                '<td class="label">{{name}}<br>, {{raum}} bei {{dozent}}</td>'+
                '</tr></table></label></li>'; // ToDo, save templates in files

            view.find('.fak'+data.fakultaet)
                .find('.sem'+data.semester)
                .append(Mustache.render(template, data));
        },

        /**
         *
         * @param callback
         */
        getCourseList: function(callback) {
            MS.db.get(
                'SELECT f.name, v.dozent, v.raum, v.studiengruppe_id, s.name AS studiengang, faks.fakultaet_id AS fakultaet, sg.semester FROM vorlesung AS v ' +
                    'JOIN fach AS f ON f.id = v.fach_id ' +
                    'JOIN fach_studiengang AS fs ON f.id = fs.fach_id ' +
                    'JOIN studiengang AS s ON fs.studiengang_id = s.id ' +
                    'JOIN fakultaet_studiengang AS faks ON faks.studiengang_id = s.id ' +
                    'JOIN studiengruppe AS sg ON sg.id = v.studiengruppe_id', callback);
        }
    };

})();