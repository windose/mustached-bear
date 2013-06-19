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


ToDos
-------------
- IDs entfernen, nur mit Klassen in lokalem scope hantieren.
- Touch highlight.
- Back button.

Aussichten
--------------
- Dependency Injection
- Lokale DOM Knoten cachen.
  Bessere Performance durch höheren Speicherverbrauch durch das Vorhalten der Elemente im DOM.
- DOM Operationen globalisieren
  Mehrere pages verwenden ähnliche routinen um Daten aus der Datenbank in das DOM zu packen. Das kann man
  unabhängig vom Ziel globalisieren.
