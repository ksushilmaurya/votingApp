var baseQuery 		= require('./baseQuery');

exports.createId = function(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

exports.getUserByUsername = function(username) {
  console.log("username is - ",username);
    return new Promise(function(resolve, reject) {
        var obj = {};
        obj.collectionName = "users";
        obj.condition = {
          username : username

        };
        baseQuery.readData(obj).then(function(userResponse) {
          console.log("Response is + ",userResponse)
          return resolve(userResponse);
        }).catch(function(error) {
          return reject(error)
        })
    })
}