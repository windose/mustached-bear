window.MS = window.MS || {};

(function() {

    var config = {
        host: 'http://78.47.122.211'
    };

    window.MS.api = {

        isOnline: function isOnline() {
            var state = window.navigator.connection.type;

            return !(state === Connection.UNKNOWN ||
                     state === Connection.NONE);
        },

        /**
         * Retrieves the news of a faculty from our api.
         * Will call <insertNews> on success.
         *
         * @param {number|String} facultyId
         * @param {Function} [callback]
         */
        getNews: function getNews(facultyId, callback) {
            callback = callback || function() {};

            if (!MS.api.isOnline()) {
                callback('Keine Internetverbindung verfügbar');
                return;
            }

            $.jsonp({
                url: config.host+'/api/nachrichten/'+facultyId,
                callback: 'app',
                success: function(data) {
                    MS.api.insertNews(data, callback);
                },
                error: function() {
                    callback('Nachrichten konnten nicht geladen werden');
                }
            });
        },

        /**
         * Todo: use drop instead of delete for performance reasons.
         *
         * @param {Object} newsList
         * @param {Function} callback
         */
        insertNews: function insertNews(newsList, callback) {
            var sql, i, news;

            sql = 'DELETE FROM nachrichten;';
            callback = callback || function() {};

            MS.db.sql(sql, function(err) {
                if (err) {
                    callback(err);
                    return;
                }

                sql = [];
                for (i=newsList.length; i--;) {
                    news = newsList[i];
                    sql.push('INSERT INTO nachrichten (' +
                        'id, fakultaet_id, title, content, ' +
                        'date, author, msg_type, start, end) ' +
                        'VALUES ("'+
                        news.id+'","'+
                        news.fakultaet_id+'","'+
                        news.title+'","'+
                        news.content+'","'+
                        news.date+'","'+
                        news.author+'","' +
                        news.msg_type+'","'+
                        news.start+'","'+
                        news.end+'");');
                }

                MS.db.sql(sql, function(err) {
                    callback(err);
                });
            });
        },

        /**
         * Retrieves the basic data required for this app to work from the api.
         * Will call <insertBasicData> on success.
         *
         * @param callback
         */
        getBasicData: function getBasicData(callback) {
            if (!MS.api.isOnline()) {
                callback('Keine Internetverbindung verfügbar');
                return;
            }

            var basicData, done;

            basicData = {};
            callback = callback || function() {};

            Step(
                function fach() {
                    done = this;

                    $.jsonp({
                        url: config.host+'/api/fach',
                        callback: 'app',
                        success: function(data) {
                            basicData.fach = data;
                            done();
                        },
                        error: function(err, msg) {
                            console.log(JSON.stringify(msg));
                            done('Fächer konnten nicht geladen werden');
                        }
                    });
                },
                function fachStudiengang(err) {
                    if (err) { throw err; }
                    if (!MS.api.isOnline()) { throw 'Keine Internetverbindung verfügbar'; }
                    done = this;

                    $.jsonp({
                        url: config.host+'/api/fach/studiengang',
                        callback: 'app',
                        success: function(data) {
                            basicData.fachStudiengang = data;
                            done();
                        },
                        error: function(err, msg) {
                            console.log(JSON.stringify(msg));
                            done('Links Fach-Studiengang konnten nicht geladen werden');
                        }
                    });
                },
                function fakultaet(err) {
                    if (err) { throw err; }
                    if (!MS.api.isOnline()) { throw 'Keine Internetverbindung verfügbar'; }
                    done = this;

                    $.jsonp({
                        url: config.host+'/api/fakultaet',
                        callback: 'app',
                        success: function(data) {
                            basicData.fakultaet = data;
                            done();
                        },
                        error: function(err, msg) {
                            console.log(JSON.stringify(msg));
                            done('Fakultäten konnten nicht geladen werden');
                        }
                    });
                },
                function fakultaetStudiengang(err) {
                    if (err) { throw err; }
                    if (!MS.api.isOnline()) { throw 'Keine Internetverbindung verfügbar'; }
                    done = this;

                    $.jsonp({
                        url: config.host+'/api/fakultaet/studiengang',
                        callback: 'app',
                        success: function(data) {
                            basicData.fakultaetStudiengang = data;
                            done();
                        },
                        error: function(err, msg) {
                            console.log(JSON.stringify(msg));
                            done('Links Fakultät-Studiengang konnten nicht geladen werden');
                        }
                    });
                },
                function studiengang(err) {
                    if (err) { throw err; }
                    if (!MS.api.isOnline()) { throw 'Keine Internetverbindung verfügbar'; }
                    done = this;

                    $.jsonp({
                        url: config.host+'/api/studiengang',
                        callback: 'app',
                        success: function(data) {
                            basicData.studiengang = data;
                            done();
                        },
                        error: function(err, msg) {
                            console.log(JSON.stringify(msg));
                            done('Studiengänge konnten nicht geladen werden');
                        }
                    });
                },
                function studiengruppen(err) {
                    if (err) { throw err; }
                    if (!MS.api.isOnline()) { throw 'Keine Internetverbindung verfügbar'; }
                    done = this;

                    $.jsonp({
                        url: config.host+'/api/studiengruppe',
                        callback: 'app',
                        success: function(data) {
                            basicData.studiengruppe = data;
                            done();
                        },
                        error: function(err, msg) {
                            console.log(JSON.stringify(msg));
                            done('Studiengruppen konnten nicht geladen werden');
                        }
                    });
                },
                function vorlesungen(err) {
                    if (err) { throw err; }
                    if (!MS.api.isOnline()) { throw 'Keine Internetverbindung verfügbar'; }
                    done = this;

                    $.jsonp({
                        url: config.host+'/api/vorlesungen',
                        callback: 'app',
                        success: function(data) {
                            basicData.vorlesungen = data;
                            done();
                        },
                        error: function(err, msg) {
                            console.log(JSON.stringify(msg));
                            done('Vorlesungen konnten nicht geladen werden');
                        }
                    });
                },
                function insertIntoDb(err) {
                    if (err) { throw err; }

                    MS.api.insertBasicData(basicData, this);
                },
                function (err) {
                    callback(err, basicData);
                }
            )
        },

        insertBasicData: function insertBasicData(data, callback) {
            var sql, i, item, done;

            callback = callback || function() {};

            Step(
                function fach() {
                    done = this;
                    sql = 'DELETE FROM fach;';

                    MS.db.sql(sql, function(err) {
                        if (err) {
                            done(err);
                            return;
                        }

                        sql = [];
                        for (i=data.fach.length; i--;) {
                            item = data.fach[i];

                            sql.push('INSERT INTO fach ' +
                                '(id, name, info) ' +
                                'VALUES ("'+
                                item.id+'","'+
                                MS.db.escape(item.name)+'","'+
                                MS.db.escape(item.info).replace(/"/g, '\'')+'");');
                        }

                        MS.db.sql(sql, done);
                    });
                },
                function fachStudiengang(err) {
                    if (err) { throw err; }
                    done = this;
                    sql = 'DELETE FROM fach_studiengang;';

                    MS.db.sql(sql, function(err) {
                        if (err) {
                            done(err);
                            return;
                        }

                        sql = [];
                        for (i=data.fachStudiengang.length; i--;) {
                            item = data.fachStudiengang[i];

                            sql.push('INSERT INTO fach_studiengang ' +
                                '(fach_id, studiengang_id) ' +
                                'VALUES ("'+
                                item.fach_id+'","'+
                                item.studiengang_id+'");');
                        }

                        MS.db.sql(sql, done);
                    });
                },
                function fakultaet(err) {
                    if (err) { throw err; }
                    done = this;
                    sql = 'DELETE FROM fakultaet;';

                    MS.db.sql(sql, function(err) {
                        if (err) {
                            done(err);
                            return;
                        }

                        sql = [];
                        for (i=data.fakultaet.length; i--;) {
                            item = data.fakultaet[i];

                            sql.push('INSERT INTO fakultaet ' +
                                '(id, name) ' +
                                'VALUES ("'+
                                item.id+'","'+
                                MS.db.escape(item.name)+'");');
                        }

                        MS.db.sql(sql, done);
                    });
                },
                function fakultaetStudiengang(err) {
                    if (err) { throw err; }
                    done = this;
                    sql = 'DELETE FROM fakultaet_studiengang;';

                    MS.db.sql(sql, function(err) {
                        if (err) {
                            done(err);
                            return;
                        }

                        sql = [];
                        for (i=data.fakultaetStudiengang.length; i--;) {
                            item = data.fakultaetStudiengang[i];
                            sql.push('INSERT INTO fakultaet_studiengang ' +
                                '(fakultaet_id, studiengang_id) ' +
                                'VALUES ("'+
                                item.fakultaet_id+'","'+
                                item.studiengang_id+'");');
                        }

                        MS.db.sql(sql, done);
                    });
                },
                function studiengang(err) {
                    if (err) { throw err; }
                    done = this;
                    sql = 'DELETE FROM studiengang;';

                    MS.db.sql(sql, function(err) {
                        if (err) {
                            done(err);
                            return;
                        }

                        sql = [];
                        for (i=data.studiengang.length; i--;) {
                            item = data.studiengang[i];

                            sql.push('INSERT INTO studiengang ' +
                                '(id, name, semesterCount) ' +
                                'VALUES ("'+
                                item.id+'","'+
                                MS.db.escape(item.name)+'","'+
                                item.semesterCount+'");');
                        }

                        MS.db.sql(sql, done);
                    });
                },
                function studiengruppen(err) {
                    if (err) { throw err; }
                    done = this;
                    sql = 'DELETE FROM studiengruppe;';

                    MS.db.sql(sql, function(err) {
                        if (err) {
                            done(err);
                            return;
                        }

                        sql = [];
                        for (i=data.studiengruppe.length; i--;) {
                            item = data.studiengruppe[i];

                            sql.push('INSERT INTO studiengruppe ' +
                                '(id, name, semester, studiengang_id) ' +
                                'VALUES ("'+
                                item.id+'","'+
                                MS.db.escape(item.name)+'","'+
                                item.semester+'","'+
                                item.studiengang_id+'");');
                        }

                        MS.db.sql(sql, done);
                    });
                },
                function vorlesungen(err) {
                    if (err) { throw err; }
                    done = this;
                    sql = 'DELETE FROM vorlesung;';

                    MS.db.sql(sql, function(err) {
                        if (err) {
                            done(err);
                            return;
                        }

                        sql = [];
                        for (i=data.vorlesungen.length; i--;) {
                            item = data.vorlesungen[i];

                            sql.push('INSERT INTO vorlesung ' +
                                '(id, type, raum, dozent, end, start, weekday, fach_id, studiengruppe_id) ' +
                                'VALUES ("' +
                                item.id+'","' +
                                item.type+'","' +
                                item.raum+'","' +
                                item.dozent+'","' +
                                item.end+'","' +
                                item.start+'","' +
                                item.weekday+'","' +
                                item.fach_id+'","' +
                                item.studiengruppe_id + '");');
                        }

                        MS.db.sql(sql, done);
                    });
                },
                function saveSyncDate(err) {
                    if (err) { throw err; }

                    sql = 'REPLACE INTO sync (type, date) VALUES ' +
                        '("full", datetime('+Math.round((moment().valueOf()/1000))+', "unixepoch"))';

                    MS.db.sql(sql, this);
                },
                function (err) {
                    callback(err);
                }
            );
        }
    };

})();