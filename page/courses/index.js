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
        init: function(header, view) {

            /*
             * Touch highlighting
             */
            header.on('touchstart', '.mheader, .coursesSem li', function() {
                $(this).addClass('touch');
            });
            view.on('touchstart', 'label, .footer span', function() {
                $(this).addClass('touch');
            });
            view.on('touchmove', 'label', function() {
                $(this).removeClass('touch');
            });

            /*
             * Switch between faculty
             */
            header.find('select').on('change', function() {
                var fak = header.find('select').val();

                $.fn.add.call(view,header)
                    .removeClass('fak'+view.attr('data-fak'))
                    .attr('data-fak', fak)
                    .addClass('fak'+view.attr('data-fak'), fak);
            });

            /*
             * Switch between semester
             */
            header.find('.coursesSem').on('touchend', 'li', function() {
                var sem = $(this).attr('data-target');

                view.removeClass('sem'+view.attr('data-sem'))
                    .attr('data-sem', sem)
                    .addClass('sem'+view.attr('data-sem'), sem);
            });

            /*
             * Toggle state of course on touch
             */
            view.on('touchend', 'li', function() {
                if (MS.isMove) { return; }

                var self = $(this);
                if (self.hasClass('on')) {
                    self.removeClass('on').addClass('off');
                } else {
                    self.removeClass('off').addClass('on');
                }
            });

        },

        /**
         *
         * @param done
         * @param header
         * @param view
         */
        enter: function(done, header, view) {

            var fakList,
                fakTemplate;

            fakList = header.find('select');
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
            view.find('ul').empty();
            MS.page.courses.getCourseList(function(err, result) {
                var i, l;
                for (i=0, l=result.length; i<l; i++) {
                    MS.page.courses.insertCourse(view, result[i]);
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