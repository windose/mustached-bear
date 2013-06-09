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
         * Displays the desired page in the dom. Will be called after
         * successfull entering the site and execution of his js.
         * This is a curried function, if you pass the desired page,
         * you will get a function to execute with the saved argument.
         *
         * @param page
         * @returns {Function}
         */
        showPage: function showPage(header, view) {
            "use strict";

            if (header || view) {
                return function() {
                    MS.navigator.showPage.apply({
                        header: header,
                        view: view
                    });
                };
            }

            this.header.show();
            this.view.show();
            // ToDo: hide loading screen
        },

        /**
         *
         * @param pagename
         */
        goTo: function goTo(pagename) {
            var pagenameLower = pagename.toLowerCase(),
                lastPagename = MS.dom.content.attr('data-content'),
                cachedView, cachedHeader;

            // ToDo Show loading screen

            cachedView = MS.dom.content.find('#view'+pagename);
            cachedHeader = MS.dom.header.find('#header'+pagename);

            /* Save desired pagename */
            MS.dom.content.attr('data-content', pagenameLower);

            /* Stay on the same page, if already loaded, login as special case */
            if (lastPagename === pagenameLower ||
                pagenameLower === 'login') {

                /* Call page specific js */
                if (typeof MS.page[lastPagename] !== 'undefined' &&
                    typeof MS.page[lastPagename].leave === 'function') {
                    MS.page[lastPagename].leave();
                }

                /* Call page specific js */
                if (typeof MS.page[pagenameLower] !== 'undefined' &&
                    typeof MS.page[pagenameLower].enter === 'function') {

                    MS.page[pagenameLower].enter(
                        MS.navigator.showPage(cachedHeader, cachedView),
                        cachedHeader, cachedView
                    );
                }

                /* Close side menu, if open */
                if(MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.back();
                }

                return;
            }

            /* Show cached page */
            if (cachedView.length > 0) {

                /* Call page specific js */
                if (typeof MS.page[lastPagename] !== 'undefined' &&
                    typeof MS.page[lastPagename].leave === 'function') {
                    MS.page[lastPagename].leave();
                }

                /* Hide last view */
                MS.dom.content.find('.view').hide();
                MS.dom.header.find('.view').hide();

                /* Show desired view */
                cachedView.show();

                /* Call page specific js */
                if (typeof MS.page[pagenameLower] !== 'undefined' &&
                    typeof MS.page[pagenameLower].enter === 'function') {

                    MS.page[pagenameLower].enter(
                        MS.navigator.showPage(cachedHeader, cachedView),
                        cachedHeader, cachedView
                    );
                }

                /* Show page specific header */
                if (cachedHeader.length > 0) {
                    MS.dom.header.attr('data-content', pagenameLower);
                    cachedHeader.show();
                }

                /* Close side menu, if open */
                if(MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.back();
                }

                /* add new page to history */
                MS.navigator.history.push(pagename);

                return;
            }

            /* Get new page */
            log('get new page');
            $.ajax({
                url: './page/'+pagenameLower+'/index.html',
                success: function(html) {

                    /* Find new views and templates */
                    var dom = $("<div></div>").html(html),
                        newView = dom.find('#view'+pagename).clone().hide(),
                        newHeader = dom.find('#header'+pagename).clone().hide(),
                        templates = dom.find('.template');

                    /* Call page specific js */
                    if (typeof MS.page[lastPagename] !== 'undefined' &&
                        typeof MS.page[lastPagename].leave === 'function') {
                        MS.page[lastPagename].leave();
                    }

                    /* Hide old and show new view */
                    MS.dom.content.find('.view').hide();
                    MS.dom.content.prepend(newView);

                    /* Hide old and attach new header */
                    if (newHeader.length > 0) {
                        MS.dom.header.find('.view').hide();
                        MS.dom.header.prepend(newHeader);
                        MS.dom.header.attr('data-content', pagenameLower);
                        MS.navigator.initSidemenu(newHeader);
                        MS.dimens.header.update();
                    }

                    /* Serve templates to the page */
                    templates.each(function() {
                        var self = $(this);
                        if ($('#'+self.attr('id')).length === 0) {
                            MS.dom.body.append(self);
                        }
                    });

                    /* Call page specific js */
                    if (typeof MS.page[pagenameLower] !== 'undefined' &&
                        typeof MS.page[pagenameLower].init === 'function') {
                        MS.page[pagenameLower].init(newHeader, newView);
                    }
                    if (typeof MS.page[pagenameLower] !== 'undefined' &&
                        typeof MS.page[pagenameLower].enter === 'function') {

                        MS.page[pagenameLower].enter(
                            MS.navigator.showPage(newHeader, newView),
                            newHeader, newView
                        );
                    }

                    /* Set fixed height */
                    newView.height(MS.dimens.viewport.height-MS.dimens.header.height);

                    /* Close side menu, if open */
                    if(MS.dom.body.hasClass('open-menu')) {
                        MS.navigator.back();
                    }

                    /* add new page to history */
                    MS.navigator.history.push(pagename);
                }
            });
        }
    };

}, false);