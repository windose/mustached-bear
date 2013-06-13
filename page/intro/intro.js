window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.intro = {
        init: function(scope) {
            log('init intro');
        },
        enter: function(done, scope) {
            log('enter intro');
            MS.dom.body.addClass('bo');
            done();
        },
        leave: function() {
            log('leave login');
            MS.dom.body.removeClass('bo');
        }
    };

})();