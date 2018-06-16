const sendCommand = require('../sendCommand.js');

module.exports = function stop(params) {
	return sendCommand('stop', params, []);
};