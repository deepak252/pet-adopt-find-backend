var admin = require("firebase-admin");

var serviceAccount = require("./serviceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

