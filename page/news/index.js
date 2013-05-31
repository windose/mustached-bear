window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.news = {
        init: function(header, view) {

            header.on('touchstart', '.mheader, .newsCal', function() {
                $(this).addClass('touch');
            });
            view.on('touchstart', 'li .article, img', function() {
                $(this).addClass('touch');
            });
            view.on('touchmove', 'li .article, img', function() {
                $(this).removeClass('touch');
            });

            header.find('.debug').html('noch '+window.devicePixelRatio+' min&nbsp;');

            /*
             * Expend a news item on touch
             */
            view.on('touchend', 'li .article', function() {
                if (MS.isMove) { return; }

                var listItem = $(this).parents('li');

                if (listItem.hasClass('open')) {
                    listItem.removeClass('open');
                } else {
                    listItem.addClass('open');
                }
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