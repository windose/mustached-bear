window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.news = {
        init: function(header, view) {
            console.log('init news');

            header.find('.debug').html('noch '+window.devicePixelRatio+' min&nbsp;');

            /*
             * Force reflow after @font-face is loaded.
             * text-align: justify will cut off text if we dont reflow.
             */
            setTimeout(function() {
                view.find('li').width(view.find('li').width());
            }, 200);

            /*
             * Expend a news item on touch
             */
            var items = view.find('li'),
                isTap = false;

            // TODO use event delegation
            // TODO BUG: dont open newsitem on closing the sidemenu
            items.bind('touchstart', function() {
                if (MS.dom.body.hasClass('open-menu')) { return; }
                isTap = true;
            });

            items.bind('touchmove', function() {
                isTap = false;
            });

            items.bind('touchend', function() {
                if (!isTap) { return; }

                var self = $(this);

                if (self.hasClass('open')) {
                    self.removeClass('open');
                } else {
                    self.addClass('open');
                }
            });

            // Add date dialog
            var template = $('#tDateDialog');

            view.find('.date').each(function() {
                $(this).after(template.clone().removeClass('template'));
            });

        },
        enter: function(header, view) {
            console.log('enter news');
        },
        leave: function() {
            console.log('leave news');
        }
    };

})();