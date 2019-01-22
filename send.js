
var admin = require("firebase-admin");

var serviceAccount = require("./node-project-f051f-firebase-adminsdk-1ygvg-883057af74.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://node-project-f051f.firebaseio.com"
});

  var options = {
    priority: "high",
    timeToLive: 60 * 60 *24
  };

  function SendMessage(payloads) {
    admin.messaging().sendToTopic("todos", payloads)
    .then(function(response) {
        console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
    });
  }
  
  module.exports.sendMessage = SendMessage;
