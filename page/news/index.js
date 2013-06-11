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
            view.on('touchend', 'li .openNews', function() {
                if (MS.isMove) { return; }

                var listItem = $(this).parents('li');

                if (listItem.hasClass('open')) {
                    listItem.removeClass('open');
                } else {
                    listItem.addClass('open');
                }
            });
        },
        enter: function(done, header, view) {
            log('enter news');

            MS.db.get('SELECT * from nachrichten', function(err, result) {
                if (err) { return log(err) && done(); }

                log('got '+result.length+' news');

                if (result.length === 0) {
                    MS.dbDummy.insertNews();
                    setTimeout(function() {
                        var i, l;
                        view.find('ul').empty();
                        for (i=0, l=result.length; i<l; i++) {
                            MS.page.news.insertNews(view, result[i]);
                        }
                        done();
                        setTimeout(function() {
                            log('force reflow');
                            view.find('li').width(view.find('li').width());
                        }, 100);
                    }, 500);
                } else {

                    var i, l;

                    view.find('ul').empty();
                    for (i=0, l=result.length; i<l; i++) {
                        MS.page.news.insertNews(view, result[i]);
                    }

                    done();


                    /*
                     * Force reflow after @font-face is loaded.
                     * text-align: justify will cut off text if we dont reflow.
                     */
                    setTimeout(function() {
                        log('force reflow');
                        view.find('li').width(view.find('li').width());
                    }, 100);

                }
            });
        },
        leave: function leave() {
            log('leave news');
        },

        /**
         * ToDo: Use template engine (mustache?)
         *
         * @param view
         * @param item
         */
        insertNews: function insertNews(view, item) {
            var template;

            template = '<li><table><tr>' +
                '<td class="icons">' +
                    '<img class="openNews" src="asset/icon/news_2.png">' +
                    '<img src="asset/icon/iconmoon-eeecef/share.png">' +
                '</td>' +
                '<td class="article openNews">'+item.content+'</td>' +
            '</tr></table></li>';

            view.find('ul').append(template);
        }
    };

})();