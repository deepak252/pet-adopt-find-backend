module.exports.petSqlObject=(tname='pets')=>{
    return `'petId', ${tname}.petId,
    'userId',  ${tname}.userId, 
    'petName',  ${tname}.petName, 
    'petInfo',  ${tname}.petInfo, 
    'breed',  ${tname}.breed, 
    'age',  ${tname}.age, 
    'addressId',  ${tname}.addressId, 
    'photos',  ${tname}.photos, 
    'category',  ${tname}.category, 
    'gender',  ${tname}.gender, 
    'petStatus',  ${tname}.petStatus, 
    'createdAt',  ${tname}.createdAt`
}

module.exports.userSqlObject=(tname='users')=>{
    return `'userId',  ${tname}.userId, 
    'fullName',  ${tname}.fullName, 
    'email',  ${tname}.email, 
    'password',  ${tname}.password, 
    'mobile',  ${tname}.mobile, 
    'profilePic',  ${tname}.profilePic,
    'fcmToken',  ${tname}.fcmToken`
}

module.exports.addressSqlObject=(tname='address')=>{
    return `'addressId',  ${tname}.addressId, 
    'addressLine',  ${tname}.addressLine, 
    'city',  ${tname}.city, 
    'state',  ${tname}.state, 
    'pincode',  ${tname}.pincode, 
    'country',  ${tname}.country, 
    'latitude',  ${tname}.latitude,
    'longitude',  ${tname}.longitude`
}


// module.exports.conversationSqlObject=(tname='conversations')=>{
//     return `'addressId',  ${tname}.addressId, 
//     'addressLine',  ${tname}.addressLine, 
//     'city',  ${tname}.city, 
//     'state',  ${tname}.state, 
//     'pincode',  ${tname}.pincode, 
//     'country',  ${tname}.country, 
//     'latitude',  ${tname}.latitude,
//     'longitude',  ${tname}.longitude`
// }