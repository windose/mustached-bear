window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.navigator = {
        history: [],

        /**
         *
         */
        initSidemenu: function initSidemenu() {
            // Event handler
            MS.dom.header.find('.openSidebarLeft').unbind('touchend').bind('touchend', function() {
                if(!MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.history.push('sidebarLeft');
                    MS.dom.sidebarLeft.show();
                    MS.dom.body.addClass('open-menu');
                    MS.dom.body.addClass('right');
                } else {
                    MS.navigator.back();
                }

                return false;
            });

            MS.dom.header.find('.openSidebarRight').unbind('touchend').bind('touchend', function() {
                if(!MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.history.push('sidebarRight');
                    MS.dom.sidebarRight.show();
                    MS.dom.body.addClass('open-menu');
                    MS.dom.body.addClass('left');
                } else {
                    MS.navigator.back();
                }

                return false;
            });

            MS.dom.body.unbind('touchend').bind('touchend', function() {
                if(MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.back();
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
            var pagenameLower = pagename.toLowerCase();

            $.ajax({
                url: './page/'+pagenameLower+'/index.html',
                success: function(html) {

                    var dom = $("<div></div>").html(html),
                        newView = dom.find('#view'+pagename).clone().removeAttr('id'),
                        newHeader = dom.find('#header'+pagename).clone().removeAttr('id'),
                        scroll;

                    MS.dom.content.html(newView);

                    if (newHeader.length > 0) {
                        MS.dom.header.html(newHeader);
                        MS.navigator.initSidemenu();
                        MS.dimens.header.update();
                    }

                    dom.find('script').prependTo(MS.dom.body);

                    newView.height(MS.dimens.viewport.height-MS.dimens.header.height);

//                    scroll = new iScroll(MS.dom.content.children('.view').first()[0], {
//                        scrollbarClass: 'scrollbar'
//                    });

                    if(MS.dom.body.hasClass('open-menu')) {
                        MS.navigator.back(function() {
                            if (typeof MS.fn === 'function') {
                                MS.fn(newHeader, newView, scroll);
                            }
                        });

                    } else {
                        if (MS.navigator.history[MS.navigator.history.length-1] !== pagename) {
                            MS.navigator.history.push(pagename);
                        }

                        if (typeof MS.fn === 'function') {
                            MS.fn(newHeader, newView, scroll);
                        }
                    }
                }
            });
        }
    };

}, false);