const sendCommand = require('../sendCommand.js');

module.exports = function pause(params) {
	return sendCommand('pause', params, []);
};