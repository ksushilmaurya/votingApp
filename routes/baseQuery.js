var Promise 	= require("bluebird");
var mongoClient = require("mongodb").MongoClient;

var createMongoConnection = function() {
	console.log("going for connection");
	return new Promise(function(resolve, reject) {
		var dbConectionUrl = "mongodb://localhost:27017/voting";
		mongoClient.connect(dbConectionUrl, function(err, client) {
			if(err) {
				return reject("Error in connection with mongo");
			} else {
				return resolve(client);
			}
		})
	})
}

exports.readData = function(obj) {
	console.log("in read data");
	return new Promise(function(resolve, reject) {
		createMongoConnection().then(function(client) {
			var db = client.db("voting");
			console.log("db connection done");
			var curser = db.collection(obj.collectionName).find(obj.condition);
			if(obj.querySelect) {
				curser = curser.project(obj.querySelect);
			}
			curser.toArray(function(err, data) {
				if(err) {
					client.close();
					return reject("Error in db connection");
				}
				client.close();
				return resolve(data);
			})
		}).catch(function(err) {
			return reject(err);
		})
	})
}

exports.insertData = function(obj) {
	return new Promise(function(resolve, reject) {
		createMongoConnection().then(function(client) {
			var db = client.db("voting");
			db.collection(obj.collectionName).insert(obj.data, function(err, data) {
				if(err) {
					client.close();
					return reject("Error in db connection");
				}
				client.close();
				return resolve(data);
			})
		})
	})
}

exports.updateData = function(obj) {
    return new Promise(function(resolve, reject) {
        createMongoConnection().then(function(client) {
            var db = client.db("voting");
            db.collection(obj.collectionName).updateOne(obj.query,obj.update, function(err, data) {
                if(err) {
                    client.close();
                    return reject("Error in db connection");
                }
                client.close();
                return resolve(data.result);
            })
        })
    })
}