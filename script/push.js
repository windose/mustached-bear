window.MS = window.MS || {};

/**
 * source: https://github.com/phonegap-build/PushPlugin
 */
(function() {

    window.onNotificationGCM = function onNotificationGCM(e) {
        console.log('EVENT -> RECEIVED:' + e.event);

        switch( e.event ) {
            case 'registered':
                if ( e.regid.length > 0 ) {
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    console.log('REGISTERED -> REGID:' + e.regid);
                }
                break;

            case 'message':
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                if (e.foreground) {
                    $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                    // if the notification contains a soundname, play it.
                    var my_media = new Media("/android_asset/www/"+e.soundname);
                    my_media.play();

                } else {
                    // otherwise we were launched because the user touched a notification in the notification tray.
                    if (e.coldstart)
                        console.log('--COLDSTART NOTIFICATION--');
                    else
                        console.log('--BACKGROUND NOTIFICATION--');
                }

                console.log('MESSAGE -> MSG: ' + e.payload.message);
                console.log('MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
                break;

            case 'error':
                console.log('ERROR -> MSG:' + e.msg);
                break;

            default:
                console.log('EVENT -> Unknown, an event was received and we do not know what it is');
                break;
        }
    };

})();