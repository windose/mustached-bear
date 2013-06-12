window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.settings = {
        init: function(scope) {
            log('init settings');
        },
        enter: function(done, scope) {
            log('enter settings');

            var i, l, list;

            list = scope.view.find('ul');
            list.empty();
            for (i=0, l=MS.logdata.length; i<l; i++) {
                list.append('<li>'+MS.logdata[i].join()+'</li>');
            }
            done();
        },
        leave: function leave() {
            log('leave settings');
        }
    };

})();