const registrationToken = 'fZEMrVGjTeixxvf0CLub6L:APA91bERZPXIiqYIIWaUUPnLEZqGR5OEbVfjxk81kOBludV30SuXSY6jD8QZtCQvknS-ljsBman4pH2UzUh8Qsh1kYb1IVXcRJE_10r3-R7UTMARb1-dJP_lvGw8kYz-Pg3X4DTtc99F';
var admin = require("firebase-admin");
var serviceAccount = require("../serviceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function sendNotification(registrationTokens, title, body) {
    return new Promise((resolve, reject) => {
        
        var payload = {
            notification: {
                title: title,
                body: body,
            },
        };
        var options = {
            priority: 'high',
            timeToLive: 86400,
            content_available: true,
        };
        admin
            .messaging()
            // .sendToTopic('adoptUs', payload, options)
            .sendToDevice(registrationTokens, payload, options)
            .then((response) => {
                console.log(
                    response.successCount,
                    ' messages were sent successfully'
                );
                resolve(true);
            })
            .catch(function (error) {
                // console.log('error:', error.errorInfo.message);
                // resolve(true);
                console.log(error)
            });
    });
}
sendNotification(registrationToken, "title", "body");