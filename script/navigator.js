window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    MS.navigator = {
        history: [],

        /**
         *
         */
        initSidemenu: function initSidemenu() {
            // Event handler
            MS.dom.header.find('.openSidebarLeft').click(function(){
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

            MS.dom.header.find('.openSidebarRight').click(function(){
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

            MS.dom.body.unbind('click').click(function(){
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
            console.log('[Navigator:goTo]', pagename);

            var newView = $('#view'+pagename).clone().removeAttr('id'),
                newHeader = $('#header'+pagename);

            MS.dom.content.html(newView);
            newView.height(MS.dimens.viewport.height-MS.dimens.header.height);

            new iScroll(MS.dom.content.children('.view').first()[0], {
                scrollbarClass: 'scrollbar'
            });

            if (newHeader.length > 0) {
                MS.dom.header.html(newHeader.clone().removeAttr('id'));
                this.initSidemenu();
            }

            if(MS.dom.body.hasClass('open-menu')) {
                MS.navigator.back();
            }

            if (MS.navigator.history[MS.navigator.history.length-1] !== pagename) {
                MS.navigator.history.push(pagename);
            }
        }
    };

}, false);