window.MS = window.MS || {};

(function() {
    window.MS.fn = function(view, scroll) {

        var courses = view.find('ul');

        view.css('width', 80*courses.length+'%');
        view.css('padding-left', 10*courses.length+'%');
        view.css('padding-right', 10*courses.length+'%');
        courses.css('width', 100/courses.length*0.8+'%');

        view.hammer().on('swipeleft', function() {
            var pos = 80/courses.length*0.8;
            view.css('-webkit-transform', 'translate3d('+pos+'%,0,0)');
        });
        view.hammer().on('swiperight', function() {
            var pos = 80/courses.length*0.8;
            view.css('-webkit-transform', 'translate3d('+pos+'%,0,0)');
        });
    }
})();