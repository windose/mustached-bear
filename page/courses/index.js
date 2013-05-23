window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.courses = {
        init: function(header, view) {
            console.log('init courses');

            /*
            view.hammer().on('swipeleft', function() {
                var pos = 80/courses.length*0.8;
                view.css('-webkit-transform', 'translate3d('+pos+'%,0,0)');
            });
            view.hammer().on('swiperight', function() {
                var pos = 80/courses.length*0.8;
                view.css('-webkit-transform', 'translate3d('+pos+'%,0,0)');
            });
            */
        },
        enter: function(header, view) {
            console.log('enter courses');
        },
        leave: function() {
            console.log('leave courses');
        }
    };

})();