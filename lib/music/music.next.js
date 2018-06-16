const sendCommand = require('../sendCommand.js');

module.exports = function next(params) {
	return sendCommand('skip', params, []);
};