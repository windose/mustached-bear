window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.courses = {

        /**
         * TODO: Event delegation
         *
         * @param header
         * @param view
         */
        init: function(header, view) {
            console.log('init courses');
            var courses;

            courses = view.find('.courses');

            header.find('.coursesSem').find('span').on('touchend', function() {
                var sem = $(this).html();
                courses.removeClass('list'+courses.attr('data-list'));
                courses.attr('data-list', sem);
                courses.addClass('list'+courses.attr('data-list'), sem);
            });

            view.find('li').on('touchend', function() {
                var self = $(this);
                if (self.hasClass('on')) {
                    self.removeClass('on').addClass('off');
                } else {
                    self.removeClass('off').addClass('on');
                }
            });

            /*
            view.hammer().on('swipeleft', function() {
                var pos = 80/courses.length*0.8;
                view.css('-webkit-transform', 'translate3d('+pos+'%,0,0)');
            });
            view.hammer().on('swiperight', function() {
                var pos = 80/courses.length*0.8;
                view.css('-webkit-transform', 'translate3d('+pos+'%,0,0)');
            });
            */
        },
        enter: function(header, view) {
            console.log('enter courses');
        },
        leave: function() {
            console.log('leave courses');
        }
    };

})();