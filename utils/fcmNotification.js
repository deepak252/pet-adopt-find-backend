var admin = require("../firebaseAdmin");
const {query} = require('../db');
const sqlQueries = require("../utils/sqlQueries");


module.exports = class SendNotification{
    /**
     * FCM Token is Required
     */
    static toFCMToken = (registrationTokens,{title, body,smallImage, bigImage})=> {
        return new Promise((resolve, reject) => {
            var data  ={};
            if(title){
                data['title'] = title
            }
            if(body){
                data['body'] = body
            }
            if(smallImage){
                data['smallImage'] = smallImage
            }
            if(bigImage){
                data['bigImage'] = bigImage
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
    /**
     * MySQL userID is Required
     */
    static toUserId = async (userId,{title, body,smallImage, bigImage})=> {
        let user = await query(sqlQueries.getUserById( userId))
        if(user.length!=0 && user[0].fcmToken){
            return this.toFCMToken(user[0].fcmToken,{
                title :title,
                body : body,
                smallImage : smallImage,
                bigImage : bigImage
            })
        }
        return ;
    }

}


// module.exports.sendNotification = (registrationTokens,{title, body,image})=> {
//     return new Promise((resolve, reject) => {
//         var data  ={};
//         if(title){
//             data['title'] = title
//         }
//         if(body){
//             data['body'] = body
//         }
//         if(image){
//             data['image'] = image
//         }
        
//         var payload = {
//             data: data,
//         };
//         var options = {
//             priority: 'high',
//             timeToLive: 86400,
//             content_available: true,
//         };
//         admin
//             .messaging()
//             // .sendToTopic('adoptUs', payload, options)
//             .sendToDevice(registrationTokens, payload, options)
//             .then((response) => {
//                 console.log(
//                     response.successCount,
//                     ' messages were sent successfully'
//                 );
//                 resolve(true);
//             })
//             .catch(function (error) {
//                 // console.log('error:', error.errorInfo.message);
//                 // resolve(true);
//                 console.log(error)
//             });
//     });
// }
