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
            scope.content.on('touchstart', 'li .article, img', function() {
                $(this).addClass('touch');
            });
            scope.content.on('touchmove', 'li .article, img', function() {
                $(this).removeClass('touch');
            });

            /*
             * Expend a single news item on touch.
             */
            scope.content.on('touchend', 'li .openNews', function() {
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
            scope.content.on('touchend', 'li .share', function() {
                if (MS.isMove) { return false; }

                var self = $(this),
                    id = self.attr('data-id'),
                    share = new Share(),
                    article = MS.page.news.articles[id];

                if (!article) {
                    MS.tools.toast.long('Artikel nicht gefunden');
                    return;
                }

                share.show({
                        subject: article.title,
                        text: article.content
                    },
                    function() {},
                    function() {
                        MS.tools.toast.long('Sharing Fehler');
                    }
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
            var self;

            Step(
                /*
                 * Get desired news from the database.
                 */
                function drawNews() {
                    self = this;
                    MS.db.get('SELECT * from nachrichten', function(err, result) {
                        if (err) {
                            return self(err.message);
                        }

                        if (result.length !== 0) {
                            var i, l, articleList;

                            articleList = scope.content.find('.articleList');

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
                                scope.content.find('li').width(scope.content.find('li').width());
                            }, 100);
                        }

                        return self();
                    });
                },

                /*
                 * Update the timeline and insert peek info.
                 */
                function drawTimeline(err) {
                    if (err) { throw err; }

                    self = this;

                    MS.timeline.getFutureDates(function(err, dates) {
                        if (err) {
                            return self(err);
                        }

                        var i, l, timeline;

                        timeline = MS.dom.sidebarRight.find('.timeline');

                        timeline.empty();
                        for (i=0, l=dates.length; i<l; i++) {
                            MS.timeline.insertDate(timeline, dates[i]);
                        }

                        MS.page.news.insertDateInfo(scope, dates[0]);

                        return self();
                    });
                },

                /*
                 * Show the page.
                 */
                function finishLoad(err) {
                    if (err) {
                        MS.tools.toast.long(err);
                    }
                    done();
                }
            );
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
                    '<img class="openNews t4" src="asset/icon/news.png">' +
                    '<img class="share" data-id="{{id}}" src="asset/icon/iconmoon-bbb9bc/share.png">' +
                '</td>' +
                '<td class="article openNews">{{title}}. {{content}}</td>' +
            '</tr></table></li>';

            $articleList.append(Mustache.render(template, article));
        },

        articles: {},

        /**
         * Insert information about the next date for the user.
         *
         * @param {Object} scope
         * @param {Object} date
         */
        insertDateInfo: function insertDateInfo(scope, date) {
            var template;

            template = '<span class="light fl">{{until}}&nbsp;</span> {{name}}';
            template = Mustache.render(template, date);

            scope.header.find('.timelinePeek').html(template);
        }
    };

})();