var Promise 		= require('bluebird');
var responses 		= require('./responses');
var commonFunction 	= require("./commonFunction");
var ObjectID        = require('mongodb').ObjectID;
var baseQuery 		= require('./baseQuery');

exports.createPoll = function(req, res) {
    Promise.coroutine(function *() {
        var request = req.body;
        console.log("request is in createPoll - ",JSON.stringify(request));

        if(!request.title || request.title.length<1) {
            return responses.sendError(res,"Title is required",{});
        }

        if(!request.options || request.options.length<1) {
            return responses.sendError(res,"Options are required",{});
        }

        yield createPollInDb(request);

        return responses.actionCompleteResponse(res);
    })().catch(function(error) {
        return responses.sendError(res,error,{});
    })
}

exports.listPoll = function(req, res) {
    Promise.coroutine(function *() {
        var request = req.body;
        console.log("request is in listPoll - ",JSON.stringify(request));

        var pollList = yield listPollFromDb(request.userDetails._id.toString());

        return responses.actionCompleteResponse(res,"",pollList);
    })().catch(function(error) {
        return responses.sendError(res,error,{});
    })
}

exports.viewPollById = function(req, res) {
    Promise.coroutine(function *() {
        var request = req.body;
        console.log("request is in viewPollById - ",JSON.stringify(request));

        var pollDetails = yield getPollById(request.pollId);

        return responses.actionCompleteResponse(res,"",pollDetails);
    })().catch(function(error) {
        return responses.sendError(res,error,{});
    })
}

exports.addOption = function(req, res) {
    Promise.coroutine(function *() {
        var request = req.body;
        console.log("request is in addOption - ",JSON.stringify(request));

        yield addNewOptionInPoll(request);

        return responses.actionCompleteResponse(res,"","");
    })().catch(function(error) {
        return responses.sendError(res,error,{});
    })
}

exports.vote = function(req, res) {
    Promise.coroutine(function *() {
        var request = req.body;
        console.log("request is in vote - ",JSON.stringify(request));

        yield updateVote(request);

        return responses.actionCompleteResponse(res);
    })().catch(function(error) {
        return responses.sendError(res,error,{});
    })
}

exports.removePoll = function(req, res) {
    Promise.coroutine(function *() {
        var request = req.body;
        console.log("request is in removePoll - ",JSON.stringify(request));

        yield removePoll(request.pollId, request.userDetails._id.toString());

        return responses.actionCompleteResponse(res,"Poll is successfully removed");
    })().catch(function(error) {
        return responses.sendError(res,error,{});
    })
}

var removePoll = function(pollId, userId) {
    return new Promise(function(resolve, reject) {
        var obj = {};
        obj.collectionName = "poll";

        try {
            pollId = new ObjectID(pollId)
        } catch(e) {
            return reject("Invalid poll id");
        }
        obj.query = {
            _id       : pollId,
            createdBy : userId
        };

        obj.update = {
            $set: { isActive :  0 }
        }

        console.log("obj is - ",obj);
        baseQuery.updateData(obj).then(function(userResponse) {
            console.log("Response is + ",userResponse)
            if(userResponse.n == 0) {
                return reject("You are not owner of poll");
            }

            if(userResponse.nModified == 0) {
                return reject("Poll is already inactive");
            }
            return resolve();
        }).catch(function(error) {
            return reject(error)
        })
    })
}

var updateVote = function(request) {
    console.log("request is - ",request);
    return new Promise(function(resolve, reject) {
        var obj = {};
        obj.collectionName = "poll";

        try {
            request.pollId = new ObjectID(request.pollId)
        } catch(e) {
            return reject("Invalid poll id");
        }

        console.log("typeof request.pollId ",typeof request.pollId);
        obj.query = {
            _id       : request.pollId,
            isActive  : 1,
            "options.name" : request.name
        };

        obj.update = {
            $inc: { "options.$.voteCount" :  1 }
        }

        console.log("obj is - ",obj);
        baseQuery.updateData(obj).then(function(userResponse) {
            console.log("Response is + ",userResponse)
            if(userResponse.n == 0) {
                return reject("Poll is not active")
            }

            if(userResponse.nModified == 0) {
                return reject("You cann't vote");
            }
            return resolve();
        }).catch(function(error) {
            return reject(error)
        })
    })
}


var addNewOptionInPoll = function(request) {
    console.log("request is - ",request);
    return new Promise(function(resolve, reject) {
        var obj = {};
        obj.collectionName = "poll";

        try {
            request.pollId = new ObjectID(request.pollId)
        } catch(e) {
            return reject("Invalid poll id");
        }

        console.log("typeof request.pollId ",typeof request.pollId);
        obj.query = {
            _id       : request.pollId,
            isActive  : 1,
        };

        obj.update = {
            $push: { "options":{name: request.name,voteCount:0} }
        }

        console.log("obj is - ",obj);
        baseQuery.updateData(obj).then(function(userResponse) {
            console.log("Response is + ",userResponse)
            if(userResponse.n == 0) {
                return reject("Poll is not active")
            }

            if(userResponse.nModified == 0) {
                return reject("You cann't add options");
            }
            return resolve();
        }).catch(function(error) {
            return reject(error)
        })
    })
}

var getPollById = function(pollId) {
    console.log("userId is - ",pollId);
    return new Promise(function(resolve, reject) {
        var obj = {};
        obj.collectionName = "poll";

        try {
            pollId = new ObjectID(pollId)
        } catch(e) {
            return reject("Invalid poll id");
        }

        obj.condition = {
            _id       : pollId,
            isActive  : 1

        };

        baseQuery.readData(obj).then(function(userResponse) {
            console.log("Response is + ",userResponse)
            return resolve(userResponse[0]);
        }).catch(function(error) {
            return reject(error)
        })
    })
}


var listPollFromDb = function(userId) {
    console.log("userId is - ",userId);
    return new Promise(function(resolve, reject) {
        var obj = {};
        obj.collectionName = "poll";
        obj.condition = {
            createdBy : userId,
            isActive  : 1

        };
        obj.querySelect = {
            "title" : 1
        }
        baseQuery.readData(obj).then(function(userResponse) {
            console.log("Response is + ",userResponse)
            return resolve(userResponse);
        }).catch(function(error) {
            return reject(error)
        })
    })
}

var createPollInDb = function(request) {
    return new Promise(function(resolve, reject) {
        console.log("options is - ",JSON.stringify(request.options));
        var options = request.options.split("\n");

        var optionsArray = [];

        for(var i=0; i<options.length; i++) {
            optionsArray.push({
                name : options[i],
                voteCount : 0
            })
        }

        var obj = {};
        obj.data = {
            createdBy : request.userDetails._id.toString(),
            title : request.title,
            isActive  : 1,
            options : optionsArray

        }
        obj.collectionName = "poll";
        baseQuery.insertData(obj).then(function(userResp) {
            return resolve();
        }).catch(function(err) {
            return reject(err);
        })
    })
}