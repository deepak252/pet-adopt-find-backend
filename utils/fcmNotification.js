var admin = require("../firebaseAdmin");


module.exports.sendNotification = (registrationTokens,{title, body,image})=> {
    return new Promise((resolve, reject) => {
        var data  ={};
        if(title){
            data['title'] = title
        }
        if(body){
            data['body'] = body
        }
        if(image){
            data['image'] = image
        }
        
        var payload = {
            data: data,
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
