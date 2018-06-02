exports.sendError = function(res, error, data) {
	var response = {
		"message" : error || "Error in execution",
		"status"  : 201,
		"data"    : data || {}
	}

	return res.send(JSON.stringify(response));
}


exports.actionCompleteResponse = function(res, msg, data) {
	var response = {
		"message" : msg || "Success",
		"status"  : 200,
		"data"    : data || {}
	}

	return res.send(JSON.stringify(response));
}