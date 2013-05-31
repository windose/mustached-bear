window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.news = {
        init: function(header, view) {

            header.on('touchstart', '.mheader, .newsCal', function() {
                $(this).addClass('touch');
            });
            view.on('touchstart', 'li', function() {
                $(this).addClass('touch');
            });
            view.on('touchmove', 'li', function() {
                $(this).removeClass('touch');
            });

            header.find('.debug').html('noch '+window.devicePixelRatio+' min&nbsp;');

            /*
             * Expend a news item on touch
             */
            view.on('touchend', 'li', function() {
                if (MS.isMove) { return; }

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

            /*
             * Force reflow after @font-face is loaded.
             * text-align: justify will cut off text if we dont reflow.
             */
            view.find('li').width(view.find('li').width());
        },
        leave: function() {
            console.log('leave news');
        }
    };

})();