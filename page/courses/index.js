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

            header.on('touchstart', '.mheader, .coursesSem li', function() {
                $(this).addClass('touch');
            });

            view.on('touchstart', 'label, .footer span', function() {
                $(this).addClass('touch');
            });
            view.on('touchmove', 'label', function() {
                $(this).removeClass('touch');
            });

            header.find('select').on('change', function() {
                var fak = header.find('select').val();

                view.removeClass('fak'+view.attr('data-fak'));
                view.attr('data-fak', fak);
                view.addClass('fak'+view.attr('data-fak'), fak);

                header.removeClass('fak'+header.attr('data-fak'));
                header.attr('data-fak', fak);
                header.addClass('fak'+header.attr('data-fak'), fak);
            });

            header.find('.coursesSem').on('touchend', 'li', function() {
                var sem = $(this).attr('data-target');

                view.removeClass('sem'+view.attr('data-sem'));
                view.attr('data-sem', sem);
                view.addClass('sem'+view.attr('data-sem'), sem);
            });

            view.on('touchend', 'li', function() {
                if (MS.isMove) { return; }

                var self = $(this);
                if (self.hasClass('on')) {
                    self.removeClass('on').addClass('off');
                } else {
                    self.removeClass('off').addClass('on');
                }
            });

            //MS.dbDummy.insertFach1();
            //MS.dbDummy.insertFach2();
        },
        enter: function(done, header, view) {
            log('enter courses');
            var fakList;

            fakList = header.find('select');

            MS.db.get(
                'SELECT id, name FROM fakultaet',
                function(err, result) {
                    var i, l;

                    for (i=0, l=result.length; i<l; i++) {
                        fakList.append('<option value="'+result[i].id+'">'+result[i].name+'</option>');
                    }
                }
            );

            var getCourses = function(callback) {
                MS.db.get(
                    'SELECT f.name, v.dozent, v.raum, v.studiengruppe_id, s.name AS studiengang, faks.fakultaet_id AS fakultaet, sg.semester FROM vorlesung AS v ' +
                        'JOIN fach AS f ON f.id = v.fach_id ' +
                        'JOIN fach_studiengang AS fs ON f.id = fs.fach_id ' +
                        'JOIN studiengang AS s ON fs.studiengang_id = s.id ' +
                        'JOIN fakultaet_studiengang AS faks ON faks.studiengang_id = s.id ' +
                        'JOIN studiengruppe AS sg ON sg.id = v.studiengruppe_id', callback);
            };

            view.find('ul').empty();

            getCourses(function(err, result) {
                var i, l;
                for (i=0, l=result.length; i<l; i++) {
                    MS.page.courses.insertCourse(view, result[i]);
                }
                done();
            });
        },
        leave: function() {
            log('leave courses');
        },

        insertCourse: function(view, data) {
            console.log(data);

            var template;

            template = '<li class="off"><label class="cf"><table><tr>'+
                '<td><img class="on" src="./asset/icon/iconmoon-bbb9bc/checkbox-checked.png"><img class="off" src="./asset/icon/iconmoon-bbb9bc/checkbox-unchecked.png"></td>'+
                '<td class="label">'+data.name+'<br>, '+data.raum+' bei '+data.dozent+'</td>'+
                '</tr></table></label></li>';

            view.find('.fak'+data.fakultaet).find('.sem'+data.semester).append(template);

        }
    };

})();