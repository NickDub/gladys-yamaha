const sendCommand = require('../sendCommand.js');

module.exports = function setVolume(params){
    var value = math.round(params.volume / 5) * 5;
    var valueIndB = value / 10;

	return sendCommand('setVolumeTo', params, [valueIndB]);
};
