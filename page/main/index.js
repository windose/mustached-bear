window.MS = window.MS || {};

(function() {
    window.MS.fn = function(view, scroll) {

        //view.find('li').hammer().on('tap', function() {
        view.find('li').on('click', function() {

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