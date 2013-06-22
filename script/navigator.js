window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.navigator = {
        history: [],

        /**
         *
         */
        initSidemenu: function initSidemenu(header) {
            // Event handler
            header.find('.openSidebarLeft').on('touchend', function(ev) {
                if(!MS.dom.body.hasClass('open-menu')) {
                    setTimeout(function() {
                        MS.navigator.history.push('sidebarLeft');
                        MS.dom.sidebarLeft.show();
                        MS.dom.body.addClass('open-menu');
                        MS.dom.body.addClass('right');
                    }, 1);
                }
            });

            header.find('.openSidebarRight').on('touchend', function(ev) {
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
         * @param {Function} [callback]
         */
        back: function back(callback) {
            if (MS.navigator.history.length === 1) {
                window.navigator.app.exitApp();
            }

            var undo = MS.navigator.history.pop();

            switch(undo) {
                case 'sidebarLeft':
                    MS.dom.body.removeClass('open-menu');
                    MS.dom.body.removeClass('right');
                    setTimeout(function() {
                        MS.dom.sidebarLeft.hide();

                        // Ugly hack, to prevent activation of select fields
                        // on sidebar closing
                        MS.dom.header.find('select').hide();
                        setTimeout(function() {
                            MS.dom.header.find('select').show();
                        }, 300);

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

                        // Ugly hack, to prevent activation of select fields
                        // on sidebar closing
                        MS.dom.header.find('select').hide();
                        setTimeout(function() {
                            MS.dom.header.find('select').show();
                        }, 300);

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
        showPage: function showPage(scope) {
            "use strict";

            if (scope) {
                return function() {
                    MS.navigator.showPage.apply(scope);
                };
            }

            if (this.overlay.length > 0) {
                this.overlay.show();
                MS.dom.overlay.removeClass('out');
            }
            this.header.show();
            this.footer.show();
            this.content.show();
            // ToDo: hide loading screen

            MS.dimens.header.update();
            MS.dimens.footer.update();

            /* Set fixed height */
            this.content.height(MS.dimens.viewport.height-MS.dimens.header.height-MS.dimens.footer.height);
        },

        /**
         *
         * @param pagename
         */
        goTo: function goTo(pagename) {
            var pagenameLower = pagename.toLowerCase(),
                lastPagename = MS.dom.wrapper.attr('data-page'),
                scope;

            // ToDo Show loading screen

            scope = {
                content: MS.dom.content.find('#content'+pagename),
                header: MS.dom.header.find('#header'+pagename),
                footer: MS.dom.footer.find('#footer'+pagename),
                overlay: MS.dom.overlay.find('#overlay'+pagename)
            };

            // Save desired pagename
            MS.dom.wrapper.attr('data-page', pagenameLower);

            // Stay on the same page, if already loaded
            if (lastPagename === pagenameLower) {

                // Call page specific js
                if (typeof MS.page[lastPagename] !== 'undefined' &&
                    typeof MS.page[lastPagename].leave === 'function') {
                    MS.page[lastPagename].leave();
                }

                // Call page specific js
                if (typeof MS.page[pagenameLower] !== 'undefined' &&
                    typeof MS.page[pagenameLower].enter === 'function') {

                    MS.page[pagenameLower].enter(MS.navigator.showPage(scope), scope);
                }

                // Close side menu, if open
                if(MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.back();
                }

                return;
            }

            // Show cached page
            if (scope.content.length > 0 ||
                scope.header.length > 0 ||
                scope.footer.length > 0 ||
                scope.overlay.length > 0) {

                console.log('show cached page');

                // Call page specific js
                if (typeof MS.page[lastPagename] !== 'undefined' &&
                    typeof MS.page[lastPagename].leave === 'function') {
                    MS.page[lastPagename].leave();
                }

                // Show cached overlay
                if (scope.overlay.length > 0) {
                    MS.dom.overlay.find('.fragment').hide();
                    MS.dom.overlay.attr('data-content', pagenameLower);
                } else {
                    MS.dom.overlay.addClass('out');
                }

                // Show cached content
                if (scope.content.length > 0) {
                    MS.dom.content.find('.fragment').hide();
                    MS.dom.content.attr('data-content', pagenameLower);
                }

                // Show cached header
                if (scope.header.length > 0) {
                    MS.dom.header.find('.fragment').hide();
                    MS.dom.header.attr('data-content', pagenameLower);
                }

                // Show cached footer
                if (scope.footer.length > 0) {
                    MS.dom.footer.find('.fragment').hide();
                    MS.dom.footer.attr('data-content', pagenameLower);
                    MS.dom.footer.show();
                } else {
                    MS.dom.footer.attr('data-content', 'none');
                    MS.dom.footer.hide();
                }

                // Call page specific js
                if (typeof MS.page[pagenameLower] !== 'undefined' &&
                    typeof MS.page[pagenameLower].enter === 'function') {

                    MS.page[pagenameLower].enter(MS.navigator.showPage(scope), scope);
                }

                // Close side menu, if open
                if(MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.back();
                }

                // add new page to history
                MS.navigator.history.push(pagename);

                return;
            }

            var html;
            Step(
                function getCSSFile() {
                    $('<link/>', {
                        rel: 'stylesheet',
                        type: 'text/css',
                        href: './page/'+pagenameLower+'/'+pagenameLower+'.css'
                    }).appendTo('head');
                    return true;
                },
                function getHtmlFile() {
                    var self = this;
                    $.ajax({
                            url: './page/'+pagenameLower+'/'+pagenameLower+'.html',
                            success: function(data) {
                                html = data;
                                self();
                            }, error: function(err) {
                                self(err);
                            }
                    });
                },
                function getJSFile() {
                    $.ajax({
                        url: './page/'+pagenameLower+'/'+pagenameLower+'.js',
                        dataType: "script",
                        success: this
                    });
                },
                function buildPage() {
                    // Find new views and templates
                    var dom = $("<div></div>").html(html),
                        templates = dom.find('.template');

                    scope = {
                        content: dom.find('#content'+pagename).clone().hide(),
                        header: dom.find('#header'+pagename).clone().hide(),
                        footer: dom.find('#footer'+pagename).clone().hide(),
                        overlay: dom.find('#overlay'+pagename).clone().hide()
                    };

                    // Call page specific js
                    if (typeof MS.page[lastPagename] !== 'undefined' &&
                        typeof MS.page[lastPagename].leave === 'function') {
                        MS.page[lastPagename].leave();
                    }

                    // Hide old and attach new Overlay
                    if (scope.overlay.length > 0) {
                        MS.dom.overlay.find('.fragment').hide();
                        MS.dom.overlay.prepend(scope.overlay);
                        MS.dom.overlay.attr('data-content', pagenameLower);
                    } else {
                        MS.dom.overlay.addClass('out');
                    }

                    // Hide old and attach new content view
                    if (scope.content.length > 0) {
                        MS.dom.content.find('.fragment').hide();
                        MS.dom.content.prepend(scope.content);
                        MS.dom.content.attr('data-content', pagenameLower);
                    }

                    // Hide old and attach new header
                    if (scope.header.length > 0) {
                        MS.dom.header.find('.fragment').hide();
                        MS.dom.header.prepend(scope.header);
                        MS.dom.header.attr('data-content', pagenameLower);
                        MS.navigator.initSidemenu(scope.header);
                    }

                    // Hide old and attach new footer
                    if (scope.footer.length > 0) {
                        MS.dom.footer.find('.fragment').hide();
                        MS.dom.footer.prepend(scope.footer);
                        MS.dom.footer.attr('data-content', pagenameLower);
                        MS.dom.footer.show();
                    } else {
                        MS.dom.footer.attr('data-content', 'none');
                        MS.dom.footer.hide();
                    }

                    // Serve templates to the page
                    templates.each(function() {
                        var self = $(this);
                        if ($('#'+self.attr('id')).length === 0) {
                            MS.dom.body.append(self);
                        }
                    });

                    // Call init function
                    if (typeof MS.page[pagenameLower] !== 'undefined' &&
                        typeof MS.page[pagenameLower].init === 'function') {
                        MS.page[pagenameLower].init(function() {

                            // Call enter function
                            if (typeof MS.page[pagenameLower] !== 'undefined' &&
                                typeof MS.page[pagenameLower].enter === 'function') {

                                MS.page[pagenameLower].enter(MS.navigator.showPage(scope), scope);
                            }

                            // Close side menu, if open
                            if(MS.dom.body.hasClass('open-menu')) {
                                MS.navigator.back();
                            }

                            // add new page to history
                            MS.navigator.history.push(pagename);

                        }, scope);
                    }
                }
            );
        }
    };

}, false);