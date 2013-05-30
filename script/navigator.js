window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.navigator = {
        history: [],

        /**
         *
         */
        initSidemenu: function initSidemenu(header) {
            // Event handler
            header.find('.openSidebarLeft').on('touchend', function() {
                if(!MS.dom.body.hasClass('open-menu')) {
                    setTimeout(function() {
                        MS.navigator.history.push('sidebarLeft');
                        MS.dom.sidebarLeft.show();
                        MS.dom.body.addClass('open-menu');
                        MS.dom.body.addClass('right');
                    }, 1);
                }
            });

            header.find('.openSidebarRight').on('touchend', function() {

                if(!MS.dom.body.hasClass('open-menu')) {
                    setTimeout(function() {
                        MS.navigator.history.push('sidebarRight');
                        MS.dom.sidebarRight.show();
                        MS.dom.body.addClass('open-menu');
                        MS.dom.body.addClass('left');
                    }, 1);
                }

            });
        },

        /**
         *
         * @param callback
         */
        back: function back(callback) {
            if (MS.navigator.history.length === 1) {
                navigator.app.exitApp();
            }

            var undo = MS.navigator.history.pop();

            switch(undo) {
                case 'sidebarLeft':
                    MS.dom.body.removeClass('open-menu');
                    MS.dom.body.removeClass('right');
                    setTimeout(function() {
                        MS.dom.sidebarLeft.hide();

                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, 200);
                    break;
                case 'sidebarRight':
                    MS.dom.body.removeClass('open-menu');
                    MS.dom.body.removeClass('left');
                    setTimeout(function() {
                        MS.dom.sidebarRight.hide();

                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, 200);
                    break;
                default:
                    MS.navigator.goTo(MS.navigator.history[MS.navigator.history.length-1]);
            }
        },

        /**
         *
         * @param pagename
         */
        goTo: function goTo(pagename) {
            var pagenameLower = pagename.toLowerCase(),
                cachedView, cachedHeader;

            cachedView = MS.dom.content.find('#view'+pagename);
            cachedHeader = MS.dom.header.find('#header'+pagename);

            if (MS.dom.content.attr('data-content') === pagenameLower) {
                /*
                 * Load Javascript
                 */
                if (typeof MS.page[pagenameLower] !== 'undefined' &&
                    typeof MS.page[pagenameLower].enter === 'function') {
                    MS.page[pagenameLower].enter(cachedHeader, cachedView);
                }

                if(MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.back();
                }
                return;
            }

            if (cachedView.length > 0) {
                MS.dom.content.find('.view').hide();
                MS.dom.header.find('.view').hide();

                MS.dom.content.attr('data-content', pagenameLower);
                cachedView.show();

                /*
                 * Load Javascript
                 */
                if (typeof MS.page[pagenameLower] !== 'undefined' &&
                    typeof MS.page[pagenameLower].enter === 'function') {
                    MS.page[pagenameLower].enter(cachedHeader, cachedView);
                }

                if (cachedHeader.length > 0) {
                    MS.dom.header.attr('data-content', pagenameLower);
                    cachedHeader.show();
                }

                if(MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.back();
                } else {
                    MS.navigator.history.push(pagename);
                }
                return;
            }

            $.ajax({
                url: './page/'+pagenameLower+'/index.html',
                success: function(html) {

                    var dom = $("<div></div>").html(html),
                        newView = dom.find('#view'+pagename).clone(),
                        newHeader = dom.find('#header'+pagename).clone(),
                        templates = dom.find('.template');

                    MS.dom.content.find('.view').hide();

                    MS.dom.content.prepend(newView);
                    MS.dom.content.attr('data-content', pagenameLower);

                    if (newHeader.length > 0) {
                        MS.dom.header.find('.view').hide();
                        MS.dom.header.prepend(newHeader);
                        MS.dom.header.attr('data-content', pagenameLower);
                        MS.navigator.initSidemenu(newHeader);
                        MS.dimens.header.update();
                    }

                    templates.each(function() {
                        var self = $(this);
                        if ($('#'+self.attr('id')).length === 0) {
                            MS.dom.body.append(self);
                        }
                    });

                    /*
                     * Load Javascript
                     */
                    if (typeof MS.page[pagenameLower] !== 'undefined' &&
                        typeof MS.page[pagenameLower].init === 'function') {
                        MS.page[pagenameLower].init(newHeader, newView);
                    }
                    if (typeof MS.page[pagenameLower] !== 'undefined' &&
                        typeof MS.page[pagenameLower].enter === 'function') {
                        MS.page[pagenameLower].enter(cachedHeader, cachedView);
                    }

                    newView.height(MS.dimens.viewport.height-MS.dimens.header.height);

                    if(MS.dom.body.hasClass('open-menu')) {
                        MS.navigator.back();
                    } else {
                        MS.navigator.history.push(pagename);
                    }
                }
            });
        }
    };

}, false);