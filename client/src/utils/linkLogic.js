module.exports.linkLogic = function () {
	const nodeEnv = process.env.NODE_ENV;
	if (nodeEnv === 'production') {
		return ""
	} else if (nodeEnv === 'development') {
		return "http://localhost:3000"
	}
}
