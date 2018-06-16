const sendCommand = require('../sendCommand.js');

module.exports = function setMuted(params) {
	if (params.muted) {
		return sendCommand('muteOn', params, [])
			.then((muted) => {
				true
			});
	} else {
		return sendCommand('muteOff', params, [])
			.then((muted) => {
				false
			});
	}
};