window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    window.MS.db = {
        obj: window.openDatabase("hmapp", "1.0", "hmapp", 1000000),
        isCreated: false
    };

    /**
     *
     * @param name
     * @param json
     * @param drop
     * @param callback
     */
    MS.db.createTable = function createTable(name, json, drop, callback) {
        var sql, columns, key;

        sql = 'CREATE TABLE IF NOT EXISTS '+name+' (';
        columns = [];
        for (key in json) {
            columns.push(key+' '+json[key]);
        }
        sql += columns.join(', ')+')';

        log('createtable', sql);
        MS.db.obj.transaction(function(tx) {

            drop && tx.executeSql('DROP TABLE IF EXISTS '+name);
            tx.executeSql(sql);

        }, function(err) {
            if (typeof callback === 'function') {
                callback(err);
            }

        }, function() {
            if (typeof callback === 'function') {
                callback();
            }
        });
    };

    /**
     *
     * @param name
     * @param callback
     */
    MS.db.loadDbConfig = function loadDbConfig(name, callback) {

        $.ajax({
            url: './config/db/'+name+'.json',
            success: function(json) {
                if (typeof callback === 'function') {
                    callback(undefined, {
                        name: name,
                        table: JSON.parse(json)
                    });
                }
            },
            error: function(err) {
                if (typeof callback === 'function') {
                    callback(err);
                }
            }
        });
    };

    /**
     *
     * @param drop
     */
    MS.db.createTables = function createTables(drop, callback) {
        var tables, i, group;

        tables = [
            'fach',
            'fach_studiengang',
            'fakultaet',
            'fakultaet_studiengang',
            'nachrichten',
            'studiengang',
            'studiengruppe',
            'type',
            'user',
            'user_vorlesung',
            'vorlesung'
        ];

        Step(
            function getConfigFiles() {
                group = this.group();
                for (i=tables.length; i--;) {
                    MS.db.loadDbConfig(tables[i], group());
                }
            },
            function createTables(err, data) {
                if (err) { return console.log(err); }

                group = this.group();
                for (i=data.length; i--;) {
                    MS.db.createTable(data[i].name, data[i].table, drop, group());
                }
            },
            function done() {
                MS.db.isCreated = true;
                if (typeof callback === 'function') {
                    callback();
                }
            }
        );
    };

    /**
     *
     * @param table
     * @param values
     */
    MS.db.insert = function insert(table, keys, values, callback) {
        MS.db.obj.transaction(function(tx) {
            tx.executeSql('INSERT INTO '+table+' ('+keys.join()+') VALUES ("'+values.join('", "')+'")');
        }, function(err) {
            callback(err);
        }, function() {
            callback(undefined);
        });
    };

    /**
     * ToDo: dont pass sql
     *
     * @param sql
     * @param callback
     */
    MS.db.get = function get(sql, callback) {
        MS.db.obj.transaction(function(tx) {

            tx.executeSql(sql, [], function(tx, results) {
                var i, l, data = [];
                for (i=0, l=results.rows.length; i<l; i++) {
                    data.push(results.rows.item(i));
                }

                callback(undefined, data);
            });

        }, function(err) {
            callback(err);
        });
    };

    /*
     * Initialize database
     */

    MS.db.createTables();
});