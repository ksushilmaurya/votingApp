var Promise 		= require('bluebird');
var responses 		= require('./responses');
var commonFunction 	= require("./commonFunction");
var md5 			= require('md5');
var baseQuery 		= require('./baseQuery');

exports.login = function(req, res) {
	Promise.coroutine(function *() {
		var request = req.body;
		console.log("request is in login - ",JSON.stringify(request));

		var accessToken = yield validateUsernamePassword(request);

		return responses.actionCompleteResponse(res,"Login Success",accessToken);
	})().catch(function(error) {
		return responses.sendError(res,error,{});
	})
}

var validateUsernamePassword = function(request) {
	return new Promise(function(resolve, reject) {

		if(!request.password) {
			return reject("Password is required");
		}

		if(!request.username) {
			return reject("Username is required");
		}

		commonFunction.getUserByUsername(request.username).then(function(user) {
			if(Array.isArray(user) && user.length>0) {
				if(user[0].password == md5(request.password)) {
					return resolve({accessToken : user[0].accessToken, userId: user[0]._id.toString()});
				} else {
					return reject("Invalid Password");
				}
			} else {
				return reject("Invalid Username");
			}
			return resolve();
		}).catch(function(err) {
			return reject(err);
		})


	})
}