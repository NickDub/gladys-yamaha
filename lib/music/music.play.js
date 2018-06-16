const sendCommand = require('../sendCommand.js');

module.exports = function play(params) {
	var paramsArray = [];

	// play song if passed in parameter
	if (params.uri) paramsArray.push(params.uri);

	return sendCommand('play', params, paramsArray);
};