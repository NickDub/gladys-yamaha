var Promise = require('bluebird');
var math = require('mathjs');
var shared = require('./shared.js');

module.exports = function exec(params) {
	return new Promise(function(resolve, reject) {
		var yamaha = shared.instances[params.deviceType.device];
		if (!yamaha) return reject(`No Yamaha receiver with deviceId ${params.deviceType.device}`);

		switch (params.deviceType.type) {
		case 'binary':
			if (params.state.value !== 1) {
				sails.log.debug('Yamaha : powerOn');
				yamaha.powerOn()
					.then(function(result) {
						sails.log.debug('Yamaha : result ' + result);
						resolve(1);
					});
			} else {
				sails.log.debug('Yamaha : powerOff');
				yamaha.powerOff()
					.then(function(result) {
						sails.log.debug('Yamaha : result ' + result);
						resolve(0);
					});
			}
			break;
/*		case 'mute':
			yamaha.isOn().then(function() {
				if (params.state.value !== 1) {
					sails.log.debug('Yamaha : muteOn');
					yamaha.muteOn()
					.then(() => resolve(1));
				} else {
					sails.log.debug('Yamaha : muteOff');
					yamaha.muteOff()
					.then(() => resolve(0));
				}
			}).then(function() {
				return reject();
			});
			break;
		case 'volume':
			yamaha.isOn().then(function() {
				var value = math.round(params.state.value / 5) * 5;
				var valueIndB = value / 10;
				sails.log.debug(`Yamaha : setVolumeTo ${valueIndB} dB`);
				yamaha.setVolumeTo(value);

				yamaha.getBasicInfo().then()
					.done(function(basicInfo) {
						var result = basicInfo.getVolume();
						sails.log.debug(`Yamaha : volume: ${result}`);
						return resolve(result);
					});
			}).then(function() {
				return reject();
			});
			break;*/
		}
	});
};