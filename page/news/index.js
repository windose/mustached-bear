window.MS = window.MS || {};

(function() {
    navigator.notification.alert('news.js loaded');

    window.MS.fn = function(view, scroll) {

        navigator.notification.alert('news.js called');

        view.find('li').hammer().on('tap', function() {
        //view.find('li').on('click', function() {

            navigator.notification.alert('tap');

            if (MS.dom.body.hasClass('open-menu')) {
                return;
            }

            var self = $(this);

            if (self.hasClass('open')) {
                self.removeClass('open');
            } else {
                self.addClass('open');
            }

            setTimeout(function() {
                scroll.refresh();
            }, 500);
        });
    }
})();