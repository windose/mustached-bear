window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    window.MS.user = {
        current: null,
        authorize: function authorize(email, pw, callback) {
            var sql;

            sql = 'SELECT * FROM user WHERE email = "'+MS.db.escape(email)+'" AND password = "'+md5(pw)+'"';

            MS.db.get(sql, function(err, data) {

                if (data.length === 0) {
                    callback('User not found');
                } else {
                    // Save id of the user in the cache, to prevent repeated login
                    localStorage.setItem('user_id', data[0].id);

                    MS.user.current = data[0];
                    callback(undefined, data[0]);
                }
            })
        },

        autoLogIn: function autoLogIn(id, callback) {
            var sql;

            sql = 'SELECT * FROM user WHERE id = '+MS.db.escape(id);

            MS.db.get(sql, function(err, data) {
                if (data.length === 0) {
                    callback('User not found');
                } else {
                    MS.user.current = data[0];
                    callback(undefined, data[0]);
                }
            })
        },

        logOut: function logOut() {
            MS.user.current = null;
            localStorage.setItem('user_id', null);
        }
    };

});