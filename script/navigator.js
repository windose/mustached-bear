window.MS = window.MS || {};

$(function() {
    MS.navigator = {
        history: [],

        initSidemenu: function() {
            // Event handler
            MS.dom.header.find('.openSidebarLeft').click(function(){
                if(!MS.dom.body.hasClass('open-menu')) {
                    MS.navigator.history.push('sidebarLeft');
                    MS.dom.sidebarLeft.show();
                    MS.dom.body.addClass('open-menu');
                    MS.dom.body.animate({marginLeft:'75%'}, 200);
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
                    MS.dom.body.animate({marginLeft:'-75%'}, 200);
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

        back: function() {
            var undo = MS.navigator.history.pop();

            switch(undo) {
                case 'sidebarLeft':
                    MS.dom.body.removeClass('open-menu');
                    MS.dom.body.animate({marginLeft:'0%'}, 200, 'swing', function() {
                        MS.dom.sidebarLeft.hide();
                    });
                    break;
                case 'sidebarRight':
                    MS.dom.body.removeClass('open-menu');
                    MS.dom.body.animate({marginLeft:'0%'}, 200, 'swing', function() {
                        MS.dom.sidebarRight.hide();
                    });
                    break;
                default:
                    MS.navigator.goTo(MS.navigator.history[MS.navigator.history.length-1]);
            }
        },

        goTo: function(pagename) {
            MS.dom.content.html($('#view_'+pagename).clone().removeAttr('id'));
            new iScroll(MS.dom.content.children('.view').first()[0]);

            this.history.push(pagename);

            var newHeader = $('#header_'+pagename);
            if (newHeader.length > 0) {
                MS.dom.header.html(newHeader.clone().removeAttr('id'));
                this.initSidemenu();
            }
        }
    };
});