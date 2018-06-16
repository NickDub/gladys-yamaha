const sendCommand = require('../sendCommand.js');

module.exports = function getMuted(params) {
	return sendCommand('getBasicInfo', params, []).then()
		.done(function(basicInfo) {
			if (basicInfo.isMuted()) return { muted : true };

			return { muted : false };
		});
};