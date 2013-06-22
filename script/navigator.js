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
            if (MS.navigator.history.length === 1 ||
               (MS.navigator.history.length === 2 &&
                MS.navigator.history[0] === 'login')) {
                window.navigator.app.exitApp();
                return;
            }

            var undo;

            undo = MS.navigator.history.pop();
            callback = callback || function() {};

            MS.dom.body.removeClass('open-menu');

            switch(undo) {
                case 'sidebarLeft':
                    MS.dom.body.removeClass('right');
                    setTimeout(function() {
                        MS.dom.sidebarLeft.hide();

                        // Ugly hack, to prevent activation of select fields
                        // on sidebar closing
                        MS.dom.header.find('select').hide();
                        setTimeout(function() {
                            MS.dom.header.find('select').show();
                        }, 300);

                        callback();
                    }, 200);
                    break;
                case 'sidebarRight':
                    MS.dom.body.removeClass('left');
                    setTimeout(function() {
                        MS.dom.sidebarRight.hide();

                        // Ugly hack, to prevent activation of select fields
                        // on sidebar closing
                        MS.dom.header.find('select').hide();
                        setTimeout(function() {
                            MS.dom.header.find('select').show();
                        }, 300);

                        callback();
                    }, 200);
                    break;
                default:
                    MS.navigator.goTo(MS.navigator.history.pop());
            }
        },

        /**
         * Displays the desired page in the dom. Will be called after
         * successfull entering the site and execution of his js.
         * This is a curried function, if you pass the desired page,
         * you will get a function to execute with the saved argument.
         *
         * @param {Object} scope
         * @param {Object} lastScope
         * @returns {Function}
         */
        showPage: function showPage(scope, lastScope) {
            "use strict";

            if (scope) {
                return function() {
                    MS.navigator.showPage.apply({
                        scope: scope,
                        lastScope: lastScope
                    });
                };
            }

            /*
             * Show new fragments
             */
            this.scope.header.show();
            this.scope.content.show();

            if (this.scope.overlay.length > 0) {
                this.scope.overlay.show();
                MS.dom.overlay.removeClass('out');
            }

            if (this.scope.footer.length > 0) {
                MS.dom.footer.show();
                this.scope.footer.show();
            }

            // Close side menu, if open
            if(MS.dom.body.hasClass('open-menu')) {
                MS.navigator.back();
            }

            if (this.scope.name !== this.lastScope.name) {

                // add new page to history
                MS.navigator.history.push(this.scope.name);

                /*
                 * Hide old fragments.
                 */
                this.lastScope.header.hide();
                this.lastScope.content.hide();
                this.lastScope.footer.hide();

                if (this.scope.overlay.length > 0) {
                    this.lastScope.overlay.hide();
                }
            }

            /*
             * Update fragment dimensions.
             */
            MS.dimens.header.update();
            MS.dimens.footer.update();

            // Set fixed content height for scrolling
            this.scope.content.height(MS.dimens.viewport.height-MS.dimens.header.height-MS.dimens.footer.height);
        },

        /**
         *
         * @param pagename
         */
        goTo: function goTo(pagename) {
            var lastPagename = MS.dom.wrapper.attr('data-page'),
                capPagename = MS.tools.capitalizeFirst(pagename),
                capLastPagename = MS.tools.capitalizeFirst(lastPagename),
                scope, lastScope;

            // ToDo Show loading screen

            scope = {
                name: pagename,
                content: MS.dom.content.find('#content'+capPagename),
                header: MS.dom.header.find('#header'+capPagename),
                footer: MS.dom.footer.find('#footer'+capPagename),
                overlay: MS.dom.overlay.find('#overlay'+capPagename)
            };

            lastScope = {
                name: lastPagename,
                content: MS.dom.content.find('#content'+capLastPagename),
                header: MS.dom.header.find('#header'+capLastPagename),
                footer: MS.dom.footer.find('#footer'+capLastPagename),
                overlay: MS.dom.overlay.find('#overlay'+capLastPagename)
            };

            // Save desired pagename
            MS.dom.wrapper.attr('data-page', pagename);

            /*
             * Page is already the current view.
             */
            if (lastPagename === pagename) {

                // Call page specific js
                if (typeof MS.page[lastPagename] !== 'undefined' &&
                    typeof MS.page[lastPagename].leave === 'function') {
                    MS.page[lastPagename].leave();
                }

                if (typeof MS.page[pagename] !== 'undefined' &&
                    typeof MS.page[pagename].enter === 'function') {
                    MS.page[pagename].enter(
                        MS.navigator.showPage(scope, lastScope),
                        scope);
                }

                return;
            }

            /*
             * Page is already loaded and cached in the DOM.
             */
            if (scope.content.length > 0 ||
                scope.header.length > 0 ||
                scope.footer.length > 0 ||
                scope.overlay.length > 0) {

                // Call page specific js
                if (typeof MS.page[lastPagename] !== 'undefined' &&
                    typeof MS.page[lastPagename].leave === 'function') {
                    MS.page[lastPagename].leave();
                }

                // Show cached overlay
                if (scope.overlay.length > 0) {
                    MS.dom.overlay.attr('data-content', pagename);
                } else {
                    MS.dom.overlay.addClass('out');
                }

                // Show cached content
                if (scope.content.length > 0) {
                    MS.dom.content.attr('data-content', pagename);
                }

                // Show cached header
                if (scope.header.length > 0) {
                    MS.dom.header.attr('data-content', pagename);
                }

                // Show cached footer
                if (scope.footer.length > 0) {
                    MS.dom.footer.attr('data-content', pagename);
                } else {
                    MS.dom.footer.attr('data-content', 'none');
                    MS.dom.footer.hide();
                }

                // Call page specific js
                if (typeof MS.page[pagename] !== 'undefined' &&
                    typeof MS.page[pagename].enter === 'function') {
                    MS.page[pagename].enter(
                        MS.navigator.showPage(scope, lastScope),
                        scope);
                }

                return;
            }

            var html;
            Step(
                function getCSSFile() {
                    $('<link/>', {
                        rel: 'stylesheet',
                        type: 'text/css',
                        href: './page/'+pagename+'/'+pagename+'.css'
                    }).appendTo('head');
                    return true;
                },
                function getHtmlFile() {
                    var self = this;
                    $.ajax({
                            url: './page/'+pagename+'/'+pagename+'.html',
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
                        url: './page/'+pagename+'/'+pagename+'.js',
                        dataType: "script",
                        success: this
                    });
                },
                function buildPage() {
                    // Find new views and templates
                    var dom = $("<div></div>").html(html),
                        templates = dom.find('.template');

                    scope.content = dom.find('#content'+capPagename).clone().hide();
                    scope.header = dom.find('#header'+capPagename).clone().hide();
                    scope.footer = dom.find('#footer'+capPagename).clone().hide();
                    scope.overlay = dom.find('#overlay'+capPagename).clone().hide();

                    // Call page specific js
                    if (typeof MS.page[lastPagename] !== 'undefined' &&
                        typeof MS.page[lastPagename].leave === 'function') {
                        MS.page[lastPagename].leave();
                    }

                    // Hide old and attach new Overlay
                    if (scope.overlay.length > 0) {
                        MS.dom.overlay.prepend(scope.overlay);
                        MS.dom.overlay.attr('data-content', pagename);
                    } else {
                        MS.dom.overlay.addClass('out');
                    }

                    // Hide old and attach new content view
                    if (scope.content.length > 0) {
                        MS.dom.content.prepend(scope.content);
                        MS.dom.content.attr('data-content', pagename);
                    }

                    // Hide old and attach new header
                    if (scope.header.length > 0) {
                        MS.dom.header.prepend(scope.header);
                        MS.dom.header.attr('data-content', pagename);
                        MS.navigator.initSidemenu(scope.header);
                    }

                    // Hide old and attach new footer
                    if (scope.footer.length > 0) {
                        MS.dom.footer.prepend(scope.footer);
                        MS.dom.footer.attr('data-content', pagename);
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
                    if (typeof MS.page[pagename] !== 'undefined' &&
                        typeof MS.page[pagename].init === 'function') {
                        MS.page[pagename].init(function() {

                            // Call enter function
                            if (typeof MS.page[pagename] !== 'undefined' &&
                                typeof MS.page[pagename].enter === 'function') {
                                MS.page[pagename].enter(
                                    MS.navigator.showPage(scope, lastScope),
                                    scope);
                            }

                        }, scope);
                    }
                }
            );
        }
    };

}, false);