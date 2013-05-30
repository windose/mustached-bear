window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.news = {
        init: function(header, view) {

            MS.dom.header.on('touchstart', '.mheader, .newsCal', function(e) {
                $(this).addClass('touch');
            });

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
        },
        leave: function() {
            console.log('leave news');
        }
    };

})();