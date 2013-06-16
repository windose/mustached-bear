window.MS = window.MS || {};

(function() {

    window.MS.dbDummy = {

        insertFaculties: function() {
            MS.db.insert('fakultaet',
                ['id', 'name'],
                [1, 'Architektur'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [2, 'Bauingenieurwesen'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [3, 'Maschinenbau, Fahrzeugtechnik, Flugzeugtechnik'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [4, 'Elektrotechnik und Informationstechnik'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [5, 'Versorgungs- und Gebäudetechnik, Verfahrenstechnik Papier und Verpackung, Druck- und Medientechnik'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [6, 'Angewandte Naturwissenschaften und Mechatronik'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [7, 'Informatik und Mathematik'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [8, 'Geoinformation'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [9, 'Wirtschaftsingenieurwesen'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [10, 'Betriebswirtschaft'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [11, 'Angewandte Sozialwissenschaften'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [12, 'Design'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [13, 'Studium Generale und Interdisziplinäre Studien'],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('fakultaet',
                ['id', 'name'],
                [14, 'Tourismus'],
                function(err) { log('insert fakultät', err); });
        },
        insertFach1: function insertFach() {
            MS.db.insert('fach',
                ['name'],
                ['Modellbildung und Simulation'],
                function(err) { log('insert fach', err); });

            MS.db.insert('vorlesung',
                [
                    'raum',
                    'dozent',
                    'type',
                    'fach_id',
                    'studiengruppe_id'
                ],
                ['R0.012', 'Prof. Eich-Soellner', 1, 1, 1],
                function(err) { log('insert vorlesung', err); });

            MS.db.insert('fach_studiengang',
                ['fach_id','studiengang_id'],
                [1, 1],
                function(err) { log('insert link', err); });

            MS.db.insert('studiengang',
                ['name', 'semesterAnzahl'],
                ['Scientific Computing', 7],
                function(err) { log('insert studiengang', err); });

            MS.db.insert('fakultaet_studiengang',
                ['fakultaet_id', 'studiengang_id'],
                [7, 1],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('studiengruppe',
                ['name', 'semester', 'studiengang_id'],
                ['IC01', 1, 1],
                function(err) { log('insert studiengruppe', err); });
        },

        insertFach2: function insertFach() {
            MS.db.insert('fach',
                ['name'],
                ['Design oder so'],
                function(err) { log('insert fach', err); });

            MS.db.insert('vorlesung',
                [
                    'raum',
                    'dozent',
                    'type',
                    'fach_id',
                    'studiengruppe_id'
                ],
                ['M012', 'Prof. Künstler', 1, 2, 2],
                function(err) { log('insert vorlesung', err); });

            MS.db.insert('fach_studiengang',
                ['fach_id','studiengang_id'],
                [2, 2],
                function(err) { log('insert link', err); });

            MS.db.insert('studiengang',
                ['name', 'semesterAnzahl'],
                ['Architektur', 7],
                function(err) { log('insert studiengang', err); });

            MS.db.insert('fakultaet_studiengang',
                ['fakultaet_id', 'studiengang_id'],
                [1, 2],
                function(err) { log('insert fakultät', err); });

            MS.db.insert('studiengruppe',
                ['name', 'semester', 'studiengang_id'],
                ['DES01', 1, 2],
                function(err) { log('insert studiengruppe', err); });
        },

        insertNews: function insertNews() {
            for (var i=0; i<10; i++) {
                MS.db.insert('nachrichten', [
                    'fakultaet_id',
                    'title',
                    'content',
                    'date',
                    'author',
                ],
                [
                    7,
                    'Lorem ipsum dolor sit amet, consetetur',
                    'sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
                    Math.round((new Date()).getTime()/100),
                    'tlukacs'
                ], function(err) {
                    log('insert news', err);
                });
            }
        },

        insertMisc: function() {
            MS.db.obj.transaction(function(tx) {
                tx.executeSql('INSERT INTO type (id, name) VALUES (1, "vorlesung")');
                tx.executeSql('INSERT INTO type (id, name) VALUES (2, "praktikum")');
            }, function(err) {
                log('enum failed', err);
            }, function() {
                log('enum success');
            });
        }

    };

})();