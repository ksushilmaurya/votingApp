var baseQuery 		= require('./baseQuery');
var responses 		= require('./responses');


exports.validateUser = function(req, res, next) {
    var accessToken = req.body.accessToken;
    console.log("accessToken is - ",accessToken);
    var obj = {};
    obj.collectionName = "users";
    obj.condition = {
        accessToken : accessToken

    };
    baseQuery.readData(obj).then(function(userResponse) {
        console.log("Response is + ",userResponse)
        if(!Array.isArray(userResponse) || !userResponse.length) {
            return responses.sendError(res,"UnAuthorize Access",{});
        } else {
            delete userResponse[0].password;
            req.body.userDetails = userResponse[0];
            return next();
        }
    }).catch(function(error) {
        return responses.sendError(res,"UnAuthorize Access",{});
    })
}