window.MS = window.MS || {};

(function() {

    MS.theme = {

        isLight: false,

        /**
         *
         */
        init: function init() {
            if (MS.user.current) {
                MS.theme.set(MS.user.current.isLightTheme);
                MS.theme.isLight = MS.user.current.isLightTheme;
            }
        },

        /**
         * Switch the included css style file to the desired theme.
         *
         * @param {boolean} isLightTheme
         */
        set: function set(isLightTheme) {
            var oldLink, newLink;

            oldLink = document.getElementById("theme");
            newLink = document.createElement("link");
            newLink.setAttribute("rel", "stylesheet");
            newLink.setAttribute("type", "text/css");
            newLink.setAttribute("id", "theme");
            newLink.setAttribute("href", './style/theme'+(isLightTheme?'_light':'')+'.css');
            document.getElementsByTagName("head").item(0).replaceChild(newLink, oldLink);

            MS.theme.setIcons($('body'), isLightTheme);
            MS.theme.setCssFiles($('head'), isLightTheme);

            MS.theme.isLight = isLightTheme;
        },

        /**
         * Replace every icon with the right path.
         *
         * @param scope
         */
        setIcons: function(scope, isLightTheme) {
            scope.find('img').each(function() {
                var self = $(this),
                    src = self.attr('src');

                if (isLightTheme && !/theme_light/g.test(src)) {
                    self.attr('src', src.replace('theme', 'theme_light'));
                } else if(!isLightTheme) {
                    self.attr('src', src.replace('theme_light', 'theme'));
                }
            });
        },

        /**
         *
         * @param scope
         * @param isLightTheme
         */
        setCssFiles: function(scope, isLightTheme) {
            scope.find('link').each(function() {
                var self = $(this),
                    href = self.attr('href');

                if (isLightTheme && !/theme_light/g.test(href)) {
                    self.attr('href', href.replace('theme', 'theme_light'));

                } else if(!isLightTheme) {
                    self.attr('href', href.replace('theme_light', 'theme'));
                }
            });
        }
    }

})();