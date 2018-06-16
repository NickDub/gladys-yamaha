var Promise = require('bluebird');

var debug = true;

module.exports = {
	getCurrentValues : function getCurrentValues(yamaha) {
		return new Promise(function(resolve, reject) {
			yamaha.getBasicInfo()
				.then(function(basicInfo) {
					var power = basicInfo.isOn();
					var muted = basicInfo.isMuted();
					var volume = basicInfo.getVolume();
					if (debug) {
						console.log(`Yamaha - Powered ${power}`);
						console.log(`Yamaha - Muted ${muted}`);
						console.log(`Yamaha - Volume ${volume}`);
					}

					return resolve({
						power : power ? 1 : 0,
						mute : muted ? 1 : 0,
						volume : volume
					});
				});
		});
	},

	changeState : function changeState(deviceType, value) {
		return new Promise(function(resolve, reject) {
			var newState = {
				devicetype : deviceType.id,
				value : value
			};

			gladys.deviceState.create(newState)
				.then(function(state) {
					console.log(`Yamaha - state ${deviceType.identifier} created`);
					return resolve();
				})
				.catch(function(err) {
					console.log(`Yamaha - Error, state ${deviceType.identifier} not created!`);
					return reject();
				});
		});
	}
};