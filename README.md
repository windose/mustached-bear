mustached-bear
==============

user state
-----------------
-1 - deactivated
 0 - registered, not confirmed
 1 - confirmed, without intro
 2 - confirmed, with intro

W3C Storage (local storage, key-value pairs) used for cache, will not be synchronised
Values:

user_id: current id of the logged in user
last_email: email address of the last login

Verwendete Technologien
------------
- less preprocessor

Verwendete Bibliotheken
------------
- jquery
  Eine weit verbreitete Bibliothek, erleichtert DOM Manipulationen und bietet
  viele convenience functions.

- mustache
  Damit neue Elemente leicht mit Daten befüllt und in das DOM gesetzt werden können,
  wird diese templating engine verwendet. Dabei wurde die Entscheidung gefällt mustache
  zu verwenden, da diese Bibliothek auf die nötigsten Funktionen reduziert und nicht
  zu groß ist.

- step.js


- moment.js


- md5


- share

- toast
https://github.com/giver/cordova-android-toast-plugin



ToDos
-------------
- IDs entfernen, nur mit Klassen in lokalem scope hantieren.
- Loading Screen
- Icon font

Aussichten
--------------
- Dependency Injection

- Dependency Managment
  z.b. mit requirejs

- Tests

- Lokale DOM Knoten cachen.
  Bessere Performance durch höheren Speicherverbrauch durch das Vorhalten der Elemente im DOM.

- DOM Operationen globalisieren
  Mehrere pages verwenden ähnliche routinen um Daten aus der Datenbank in das DOM zu packen. Das kann man
  unabhängig vom Ziel globalisieren.

- SQL Queries entJOINen
