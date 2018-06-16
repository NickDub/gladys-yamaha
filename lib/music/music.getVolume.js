const sendCommand = require('../sendCommand.js');

module.exports = function getVolume(params) {
	return sendCommand('getBasicInfo', params, []).then()
		.done(function(basicInfo) {
			var volume = basicInfo.getVolume();
			return { volume : volume * 10 }
		});
};