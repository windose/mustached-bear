window.MS = window.MS || {};

(function() {

    window.MS.dbDummy = function dbDummy(callback) {
        var sql = [];

        sql.push("INSERT INTO `fach` (`id`, `name`, `info`, `last_update`) VALUES" +
            "(1, 'Modellbildung und Simulation', NULL, NULL)," +
            "(2, 'Design oder so', NULL, NULL)," +
            "(3, 'Mobile Anwendungen', NULL, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `fach_studiengang` (`fach_id`, `studiengang_id`, `last_update`) VALUES" +
            "(1, 1, '0000-00-00 00:00:00')," +
            "(2, 2, NULL)," +
            "(3, 1, '0000-00-00 00:00:00')," +
            "(3, 3, '0000-00-00 00:00:00')");

        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(1, 'Architektur', NULL)," +
            "(2, 'Bauingenieurwesen', NULL)," +
            "(3, 'Maschinenbau, Fahrzeugtechnik, Flugzeugtechnik', NULL)," +
            "(4, 'Elektrotechnik und Informationstechnik', NULL)," +
            "(5, 'Versorgungs- und Gebäudetechnik, Verfahrenstechnik Papier und Verpackung, Druck- und Medientechnik', NULL)," +
            "(6, 'Angewandte Naturwissenschaften und Mechatronik', NULL)," +
            "(7, 'Informatik und Mathematik', NULL)," +
            "(8, 'Geoinformation', NULL)," +
            "(9, 'Wirtschaftsingenieurwesen', NULL)," +
            "(10, 'Betriebswirtschaft', NULL)," +
            "(11, 'Angewandte Sozialwissenschaften', NULL)," +
            "(12, 'Design', NULL)," +
            "(13, 'Studium Generale und Interdisziplinäre Studien', NULL)," +
            "(14, 'Tourismus', NULL);");

        sql.push("INSERT INTO `fakultaet_studiengang` (`fakultaet_id`, `studiengang_id`, `last_update`) VALUES" +
            "(7, 1, '0000-00-00 00:00:00')," +
            "(1, 2, NULL)," +
            "(7, 3, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `nachrichten` (`id`, `fakultaet_id`, `title`, `content`, `date`, `author`, `msg_type`, `start`, `end`, `last_update`) VALUES" +
            "(1, NULL, 'Sprechstunde am Mittwoch, den 29.05.2013', 'Die Sprechstunde am Mittwoch, den 29.05.2013 um 12:30 Uhr wird auf 14:00 Uhr verschoben.', '0000-00-00 00:00:00', 'Kirch Ulla', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL)," +
            "(2, NULL, 'Prüfungstermine Netzwerke II', 'Die mündlichen Prüfungen zur Vorlesung Netzwerke II (Prof. Soceanu) finden statt am Donnerstag 4.7.2013 und Freitag 5.7.2013 in R3.014. Die Zeiten für die Einzelprüfungen finden Sie in Moodle.', '0000-00-00 00:00:00', 'Köhler Klaus', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL)," +
            "(3, NULL, 'Funktionale Programmierung entfällt heute', 'Die Vorlesung \"Funktionale Programmierung\" muss heute leider aus gesundheitlichen Gründen entfallen. Bitte nutzen Sie die Zeit um sich schon einmal in das nächste Kapitel einzulesen (siehe URL) Bei Fragen zum bevorstehenden Vortrag nehmen Sie bitte per E-Mail mit mir Verbindung auf.', '0000-00-00 00:00:00', 'Braun Oliver', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL)," +
            "(4, NULL, 'Übung zur Vorlesung \"Statistik und OR\"', 'Wie vereinbart entfällt am Freitag, den 21.06.13, die Übung. Diese wurde bereits vorgeholt.', '0000-00-00 00:00:00', 'Schwenkert Rainer', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL)," +
            "(5, NULL, 'Sprechstunde Hof entfällt am 19.06', 'Meine Sprechstunde am 19.06. entfällt.', '0000-00-00 00:00:00', 'Hof Hans-Joachim', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL);");

        sql.push("INSERT INTO `nachrichten` (`id`, `fakultaet_id`, `title`, `content`, `date`, `author`, `msg_type`, `start`, `end`, `last_update`) VALUES" +
            "(6, NULL, 'Sprechstunde am Mittwoch, den 29.05.2013', 'Die Sprechstunde am Mittwoch, den 29.05.2013 um 12:30 Uhr wird auf 14:00 Uhr verschoben.', '0000-00-00 00:00:00', 'Kirch Ulla', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL)," +
            "(7, NULL, 'Prüfungstermine Netzwerke II', 'Die mündlichen Prüfungen zur Vorlesung Netzwerke II (Prof. Soceanu) finden statt am Donnerstag 4.7.2013 und Freitag 5.7.2013 in R3.014. Die Zeiten für die Einzelprüfungen finden Sie in Moodle.', '0000-00-00 00:00:00', 'Köhler Klaus', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL)," +
            "(8, NULL, 'Funktionale Programmierung entfällt heute', 'Die Vorlesung \"Funktionale Programmierung\" muss heute leider aus gesundheitlichen Gründen entfallen. Bitte nutzen Sie die Zeit um sich schon einmal in das nächste Kapitel einzulesen (siehe URL) Bei Fragen zum bevorstehenden Vortrag nehmen Sie bitte per E-Mail mit mir Verbindung auf.', '0000-00-00 00:00:00', 'Braun Oliver', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL)," +
            "(9, NULL, 'Übung zur Vorlesung \"Statistik und OR\"', 'Wie vereinbart entfällt am Freitag, den 21.06.13, die Übung. Diese wurde bereits vorgeholt.', '0000-00-00 00:00:00', 'Schwenkert Rainer', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL)," +
            "(10, NULL, 'Sprechstunde Hof entfällt am 19.06', 'Meine Sprechstunde am 19.06. entfällt.', '0000-00-00 00:00:00', 'Hof Hans-Joachim', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL);");

        sql.push("INSERT INTO `studiengang` (`id`, `name`, `semesterCount`, `last_update`) VALUES" +
            "(1, 'Informatik', 7, NULL)," +
            "(2, 'Architektur', 6, NULL)," +
            "(3, 'Scientific Computing', 8, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `studiengruppe` (`id`, `name`, `semester`, `studiengang_id`, `last_update`) VALUES" +
            "(5, 'if4b', '4', 1, '2013-06-15 00:12:17')," +
            "(6, 'DES01', '1', 2, '0000-00-00 00:00:00')," +
            "(7, 'ic7b', '7', 3, '2013-06-15 00:12:17');");

        sql.push("INSERT INTO `type` (`id`, `name`) VALUES" +
            "(1, 'Vorlesung')," +
            "(2, 'Praktikum');");

        sql.push("INSERT INTO `user` (`id`, `state`, `email`, `password`, `studiengruppe_id`, `isPush`, `isSync`, `isLightTheme`, `isBackup`, `last_update`, `validcookie`) VALUES" +
            "(1, 0, 'f1re@me.ee', '098f6bcd4621d373cade4e832627b4f6', NULL, 0, 0, 0, 0, '2013-05-26 18:49:04', 'e07grbm7k4q48bhco8258jmc80')," +
            "(2, 0, 'test@test.de', '098f6bcd4621d373cade4e832627b4f6', NULL, 0, 0, 0, 0, NULL, 'u51f8ffue34si9pmlrcval9sq6')," +
            "(3, 0, 'abc@abc.de', '900150983cd24fb0d6963f7d28e17f72', NULL, 0, 0, 0, 0, NULL, 'es2o4pip563e5h5vf83cjnbf06')," +
            "(4, 0, 'ab@ab.de', '187ef4436122d1cc2f40dc2b92f0eba0', NULL, 0, 0, 0, 0, NULL, 'es2o4pip563e5h5vf83cjnbf06')," +
            "(5, 0, 'hans@klaus.de', 'f2a0ffe83ec8d44f2be4b624b0f47dde', NULL, 0, 0, 0, 0, NULL, 'ailufuepigv2o8ctco12j4a4k5')," +
            "(6, 0, 'hans@hans.com', 'f2a0ffe83ec8d44f2be4b624b0f47dde', NULL, 0, 0, 0, 0, '2013-06-18 16:30:06', 'es2o4pip563e5h5vf83cjnbf06')," +
            "(7, 2, 'riplexus@gmail.com', 'fc5e038d38a57032085441e7fe7010b0', 7, 1, 1, 0, 1, '2013-06-18 18:57:38', NULL);");

        sql.push("INSERT INTO `user_vorlesung` (`user_id`, `vorlesung_id`, `last_update`) VALUES" +
            "(7, 4, '2013-06-18 18:59:39')," +
            "(7, 5, '2013-06-18 18:59:43')," +
            "(6, 2, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `vorlesung` (`id`, `type`, `raum`, `dozent`, `end`, `start`, `weekday`, `last_update`, `fach_id`, `studiengruppe_id`) VALUES" +
            "(1, 1, 'R1.002', 'Kirch', '13:00', '10:00', 0, '2013-06-18 17:24:13', 2, 6)," +
            "(2, 1, 'R0.012', 'Prof. Eich-Soellner', '11:30', '10:00', 0, '2013-06-18 17:24:23', 1, 5)," +
            "(3, 1, 'R1.012', 'Prof. Wischhof', '13:15', '16:45', 1, '2013-06-18 18:50:33', 3, 5)," +
            "(4, 1, 'R1.012', 'Prof. Wischhof', '13:15', '16:45', 1, '2013-06-18 18:50:33', 3, 7)," +
            "(5, 1, 'R0.012', 'Prof. Eich-Soellner', '11:30', '10:00', 0, '2013-06-18 17:24:23', 1, 7);");

        MS.db.sql(sql, function(err) {
            if (err) {
                Toast.longshow(err.message);
            }

            callback();
        });
    };

})();