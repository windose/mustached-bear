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
            list = scope.view.find('#changeFaculty');
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
                var self = $(this),
                    fak = self.val(),
                    list = scope.view.find('.semList'),
                    text = self.find(':selected').text(),
                    valueField = self.parent().find('.selectContent');

                list.removeClass('fak'+list.attr('data-fak'))
                    .attr('data-fak', fak)
                    .addClass('fak'+list.attr('data-fak'), fak);

                valueField.html(text);
            });

            /*
             * Hide / Show footer to prevent buggy position absolute
             */
            document.addEventListener("showkeyboard", function() {
                MS.dom.footer.hide();
            }, false);

            document.addEventListener("hidekeyboard", function() {
                setTimeout(function() {
                    MS.dom.footer.show();
                }, 200);
            }, false);

            scope.view.find('#changeTheme').on('change', function() {
                var checked = $(this).is(':checked'),
                    oldLink, newLInk;

                oldLink = document.getElementById("theme");
                newLink = document.createElement("link")
                newLink.setAttribute("rel", "stylesheet");
                newLink.setAttribute("type", "text/css");
                newLink.setAttribute("id", "theme");
                newLink.setAttribute("href", './style/style'+(checked?'_light':'')+'.css');
                document.getElementsByTagName("head").item(0).replaceChild(newLink, oldLink);
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