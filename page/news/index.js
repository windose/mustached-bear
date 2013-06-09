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
            var self = this;

            console.log('enter news');

            // Insert dummy data
//            for (var i=0; i<10; i++) {
//                MS.db.insert('nachrichten', [
//                    'fakultaet_id',
//                    'title',
//                    'content',
//                    'date',
//                    'author',
//                    'msg_type'
//                ],
//                [
//                    7,
//                    'Lorem ipsum dolor sit amet, consetetur',
//                    'sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
//                    Math.round((new Date()).getTime()/100),
//                    'tlukacs',
//                    '1'
//                ], function(err) {
//                    console.log('insert news', err);
//                });
//            }

            MS.db.get('SELECT * from nachrichten', function(err, result) {
                console.log(err, result);
            });

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