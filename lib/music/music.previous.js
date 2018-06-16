const sendCommand = require('../sendCommand.js');

module.exports = function previous(params) {
	return sendCommand('rewind', params, []);
};