window.MS = window.MS || {};

(function() {

    window.MS.dbDummy = function dbDummy(callback) {
        var sql = [];

        sql.push("INSERT INTO fach (id, name, info, last_update) VALUES " +
            "(1, 'Modellbildung und Simulation', NULL, NULL);");

        sql.push("INSERT INTO fach (id, name, info, last_update) VALUES " +
            "(2, 'Design oder so', NULL, NULL);");

        sql.push("INSERT INTO fach (id, name, info, last_update) VALUES " +
            "(3, 'Mobile Anwendungen', NULL, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `fach_studiengang` (`fach_id`, `studiengang_id`, `last_update`) VALUES" +
            "(1, 1, '0000-00-00 00:00:00');");
        sql.push("INSERT INTO `fach_studiengang` (`fach_id`, `studiengang_id`, `last_update`) VALUES" +
            "(2, 2, NULL);");
        sql.push("INSERT INTO `fach_studiengang` (`fach_id`, `studiengang_id`, `last_update`) VALUES" +
            "(3, 1, '0000-00-00 00:00:00');");
        sql.push("INSERT INTO `fach_studiengang` (`fach_id`, `studiengang_id`, `last_update`) VALUES" +
            "(3, 3, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(1, 'Architektur', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(2, 'Bauingenieurwesen', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(3, 'Maschinenbau, Fahrzeugtechnik, Flugzeugtechnik', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(4, 'Elektrotechnik und Informationstechnik', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(5, 'Versorgungs- und Gebäudetechnik, Verfahrenstechnik Papier und Verpackung, Druck- und Medientechnik', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(6, 'Angewandte Naturwissenschaften und Mechatronik', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(7, 'Informatik und Mathematik', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(8, 'Geoinformation', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(9, 'Wirtschaftsingenieurwesen', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(10, 'Betriebswirtschaft', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(11, 'Angewandte Sozialwissenschaften', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(12, 'Design', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(13, 'Studium Generale und Interdisziplinäre Studien', NULL);");
        sql.push("INSERT INTO `fakultaet` (`id`, `name`, `last_update`) VALUES" +
            "(14, 'Tourismus', NULL);");

        sql.push("INSERT INTO `fakultaet_studiengang` (`fakultaet_id`, `studiengang_id`, `last_update`) VALUES" +
            "(7, 1, '0000-00-00 00:00:00');");
        sql.push("INSERT INTO `fakultaet_studiengang` (`fakultaet_id`, `studiengang_id`, `last_update`) VALUES" +
            "(1, 2, NULL);");
        sql.push("INSERT INTO `fakultaet_studiengang` (`fakultaet_id`, `studiengang_id`, `last_update`) VALUES" +
            "(7, 3, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `studiengang` (`id`, `name`, `semesterCount`, `last_update`) VALUES" +
            "(1, 'Informatik', 7, NULL);");
        sql.push("INSERT INTO `studiengang` (`id`, `name`, `semesterCount`, `last_update`) VALUES" +
            "(2, 'Architektur', 6, NULL);");
        sql.push("INSERT INTO `studiengang` (`id`, `name`, `semesterCount`, `last_update`) VALUES" +
            "(3, 'Scientific Computing', 8, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `studiengruppe` (`id`, `name`, `semester`, `studiengang_id`, `last_update`) VALUES" +
            "(5, 'if4b', '4', 1, '2013-06-15 00:12:17');");
        sql.push("INSERT INTO `studiengruppe` (`id`, `name`, `semester`, `studiengang_id`, `last_update`) VALUES" +
            "(6, 'DES01', '1', 2, '0000-00-00 00:00:00');");
        sql.push("INSERT INTO `studiengruppe` (`id`, `name`, `semester`, `studiengang_id`, `last_update`) VALUES" +
            "(7, 'ic7b', '7', 3, '2013-06-15 00:12:17');");

        sql.push("INSERT INTO `type` (`id`, `name`) VALUES" +
            "(1, 'Vorlesung');");
        sql.push("INSERT INTO `type` (`id`, `name`) VALUES" +
            "(2, 'Praktikum');");

        sql.push("INSERT INTO `user` (`id`, `state`, `email`, `password`, `studiengruppe_id`, `isPush`, `isSync`, `isLightTheme`, `isBackup`, `last_update`, `validcookie`) VALUES" +
            "(1, 0, 'f1re@me.ee', '098f6bcd4621d373cade4e832627b4f6', NULL, 0, 0, 0, 0, '2013-05-26 18:49:04', 'e07grbm7k4q48bhco8258jmc80');");
        sql.push("INSERT INTO `user` (`id`, `state`, `email`, `password`, `studiengruppe_id`, `isPush`, `isSync`, `isLightTheme`, `isBackup`, `last_update`, `validcookie`) VALUES" +
            "(2, 0, 'test@test.de', '098f6bcd4621d373cade4e832627b4f6', NULL, 0, 0, 0, 0, NULL, 'u51f8ffue34si9pmlrcval9sq6');");
        sql.push("INSERT INTO `user` (`id`, `state`, `email`, `password`, `studiengruppe_id`, `isPush`, `isSync`, `isLightTheme`, `isBackup`, `last_update`, `validcookie`) VALUES" +
            "(3, 0, 'abc@abc.de', 'fc5e038d38a57032085441e7fe7010b0', NULL, 0, 0, 0, 0, NULL, 'es2o4pip563e5h5vf83cjnbf06');");
        sql.push("INSERT INTO `user` (`id`, `state`, `email`, `password`, `studiengruppe_id`, `isPush`, `isSync`, `isLightTheme`, `isBackup`, `last_update`, `validcookie`) VALUES" +
            "(4, 0, 'ab@ab.de', '187ef4436122d1cc2f40dc2b92f0eba0', NULL, 0, 0, 0, 0, NULL, 'es2o4pip563e5h5vf83cjnbf06');");
        sql.push("INSERT INTO `user` (`id`, `state`, `email`, `password`, `studiengruppe_id`, `isPush`, `isSync`, `isLightTheme`, `isBackup`, `last_update`, `validcookie`) VALUES" +
            "(5, 0, 'hans@klaus.de', 'f2a0ffe83ec8d44f2be4b624b0f47dde', NULL, 0, 0, 0, 0, NULL, 'ailufuepigv2o8ctco12j4a4k5');");
        sql.push("INSERT INTO `user` (`id`, `state`, `email`, `password`, `studiengruppe_id`, `isPush`, `isSync`, `isLightTheme`, `isBackup`, `last_update`, `validcookie`) VALUES" +
            "(6, 0, 'hans@hans.com', 'f2a0ffe83ec8d44f2be4b624b0f47dde', NULL, 0, 0, 0, 0, '2013-06-18 16:30:06', 'es2o4pip563e5h5vf83cjnbf06');");
        sql.push("INSERT INTO `user` (`id`, `state`, `email`, `password`, `studiengruppe_id`, `isPush`, `isSync`, `isLightTheme`, `isBackup`, `last_update`, `validcookie`) VALUES" +
            "(7, 2, 'riplexus@gmail.com', 'fc5e038d38a57032085441e7fe7010b0', 7, 1, 1, 0, 1, '2013-06-18 18:57:38', NULL);");

        sql.push("INSERT INTO `user_vorlesung` (`user_id`, `vorlesung_id`, `last_update`) VALUES" +
            "(7, 4, '2013-06-18 18:59:39');");
        sql.push("INSERT INTO `user_vorlesung` (`user_id`, `vorlesung_id`, `last_update`) VALUES" +
            "(7, 5, '2013-06-18 18:59:43');");
        sql.push("INSERT INTO `user_vorlesung` (`user_id`, `vorlesung_id`, `last_update`) VALUES" +
            "(6, 2, '0000-00-00 00:00:00');");

        sql.push("INSERT INTO `vorlesung` (`id`, `type`, `raum`, `dozent`, `end`, `start`, `weekday`, `last_update`, `fach_id`, `studiengruppe_id`) VALUES" +
            "(1, 1, 'R1.002', 'Kirch', '13:00', '10:00', 0, '2013-06-18 17:24:13', 2, 6);");
        sql.push("INSERT INTO `vorlesung` (`id`, `type`, `raum`, `dozent`, `end`, `start`, `weekday`, `last_update`, `fach_id`, `studiengruppe_id`) VALUES" +
            "(2, 1, 'R0.012', 'Prof. Eich-Soellner', '11:30', '10:00', 0, '2013-06-18 17:24:23', 1, 5);");
        sql.push("INSERT INTO `vorlesung` (`id`, `type`, `raum`, `dozent`, `end`, `start`, `weekday`, `last_update`, `fach_id`, `studiengruppe_id`) VALUES" +
            "(3, 1, 'R1.012', 'Prof. Wischhof', '13:15', '16:45', 1, '2013-06-18 18:50:33', 3, 5);");
        sql.push("INSERT INTO `vorlesung` (`id`, `type`, `raum`, `dozent`, `end`, `start`, `weekday`, `last_update`, `fach_id`, `studiengruppe_id`) VALUES" +
            "(4, 1, 'R1.012', 'Prof. Wischhof', '13:15', '16:45', 1, '2013-06-18 18:50:33', 3, 7);");
        sql.push("INSERT INTO `vorlesung` (`id`, `type`, `raum`, `dozent`, `end`, `start`, `weekday`, `last_update`, `fach_id`, `studiengruppe_id`) VALUES" +
            "(5, 1, 'R0.012', 'Prof. Eich-Soellner', '11:30', '10:00', 0, '2013-06-18 17:24:23', 1, 7);");

        MS.db.sql(sql, function(err) {
            if (err) {
                MS.tools.toast.long(err.message);
            }

            callback();
        });
    };

})();