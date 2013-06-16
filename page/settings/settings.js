window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.settings = {
        init: function(scope) {
            log('init settings');

            var list, itemTemplate;

            itemTemplate = '<option value={{id}}>{{name}}</option>'; // ToDo, save templates in files

            /*
             * Get and insert faculties from database
             */
            list = scope.view.find('#changeFakulty');
            list.empty();
            MS.db.get(
                'SELECT id, name FROM fakultaet',
                function(err, result) {
                    var i, l;
                    for (i=0, l=result.length; i<l; i++) {
                        list.append(Mustache.render(itemTemplate, result[i]));
                    }
                }
            );

            /*
             * Switch between faculty
             */
            list.on('change', function() {
                var fak = $(this).val(),
                    list = scope.view.find('.semList');

                list.removeClass('fak'+list.attr('data-fak'))
                    .attr('data-fak', fak)
                    .addClass('fak'+list.attr('data-fak'), fak);
            });
        },
        enter: function(done, scope) {
            log('enter settings');

            done();
        },
        leave: function leave() {
            log('leave settings');
        }
    };

})();