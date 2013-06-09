window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.settings = {
        init: function(header, view) {
        },
        enter: function(done, header, view) {
            var i, l, list;

            list = view.find('ul');
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