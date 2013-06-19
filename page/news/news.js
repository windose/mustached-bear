window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.news = {

        /**
         * Basic functionality, touch highlighting and event handlers.
         * Will be called once.
         *
         * @param {Function} done
         * @param {Object} scope
         */
        init: function(done, scope) {

            /*
             * Touch highlighting.
             */
            scope.header.on('touchstart', '.mheader, .newsCal', function() {
                $(this).addClass('touch');
            });
            scope.view.on('touchstart', 'li .article, img', function() {
                $(this).addClass('touch');
            });
            scope.view.on('touchmove', 'li .article, img', function() {
                $(this).removeClass('touch');
            });

            /*
             * Expend a single news item on touch.
             */
            scope.view.on('touchend', 'li .openNews', function() {
                if (MS.isMove) { return; }

                var listItem = $(this).parents('li');

                if (listItem.hasClass('open')) {
                    listItem.removeClass('open');
                } else {
                    listItem.addClass('open');
                }
            });

            /*
             * Share news button.
             */
            scope.view.on('touchend', 'li .share', function() {
                if (MS.isMove) { return false; }

                var self = $(this),
                    id = self.attr('data-id'),
                    share = new Share(),
                    article = MS.page.news.articles[id];

                if (!article) {
                    return console.log('Article not found');
                }

                share.show({
                        subject: article.title,
                        text: article.content
                    },
                    function() {},
                    function() { console.log('Share failed') }
                );

                return true;
            });

            done();
        },

        /**
         * Get desired news from the database and insert them with <insertNews>.
         * ToDo Limit
         *
         * @param {Function} done
         * @param {Object} scope
         */
        enter: function(done, scope) {

            /*
             * Get desired news from the database.
             */
            MS.db.get('SELECT * from nachrichten', function(err, result) {
                if (err) { return console.log(err) && done(); }

                if (result.length !== 0) {
                    var i, l, articleList;

                    articleList = scope.view.find('.articleList');

                    articleList.empty();
                    for (i=0, l=result.length; i<l; i++) {
                        MS.page.news.articles[result[i].id] = result[i];
                        MS.page.news.insertNews(articleList, result[i]);
                    }

                    /*
                     * Hack, force reflow after @font-face is loaded.
                     * text-align: justify will cut off text if we don't reflow.
                     */
                    setTimeout(function() {
                        scope.view.find('li').width(scope.view.find('li').width());
                    }, 100);
                }

                return done();
            });

            MS.page.news.insertDateInfo(scope);
        },

        /**
         * Do nothing yet.
         */
        leave: function leave() {},

        /**
         * Insert a single news item into the DOM.
         *
         * @param {Object} $articleList
         * @param {Object} article
         */
        insertNews: function insertNews($articleList, article) {
            var template;

            template = '<li><table><tr>' +
                '<td class="icons">' +
                    '<img class="openNews" src="asset/icon/news_2.png">' +
                    '<img class="share" data-id="{{id}}" src="asset/icon/iconmoon-eeecef/share.png">' +
                '</td>' +
                '<td class="article openNews"><span class="title">{{title}}.</span> {{content}}</td>' +
            '</tr></table></li>';

            $articleList.append(Mustache.render(template, article));
        },

        articles: {},

        /**
         * Insert information about the next date for the user.
         *
         * @param {Object} scope
         */
        insertDateInfo: function insertDateInfo(scope) {
            scope.header.find('.debug').html('noch '+window.devicePixelRatio+' min&nbsp;');
        }
    };

})();