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

            var listItems,
                isTap;

            header.find('.coursesSem').find('span').on('touchend', function() {
                var sem = $(this).html();
                view.removeClass('list'+view.attr('data-list'));
                view.attr('data-list', sem);
                view.addClass('list'+view.attr('data-list'), sem);
            });


            listItems = view.find('li');

            items.on('touchstart', function() {
                isTap = true;
            });

            items.on('touchmove', function() {
                isTap = false;
            });

            listItems.on('touchend', function() {
                if (!isTap) { return; }

                var self = $(this);
                if (self.hasClass('on')) {
                    self.removeClass('on').addClass('off');
                } else {
                    self.removeClass('off').addClass('on');
                }
            });
        },
        enter: function(header, view) {
            console.log('enter courses');
        },
        leave: function() {
            console.log('leave courses');
        }
    };

})();