var Promise = require('bluebird');
var math = require('mathjs');
var shared = require('./shared.js');
var utils = require('./utils');

module.exports = function exec(params) {
	return new Promise(function(resolve, reject) {
		var yamaha = shared.instances[params.deviceType.device];
		if (!yamaha) return reject(`No Yamaha receiver with deviceId ${params.deviceType.device}`);

		switch (params.deviceType.type) {
		case 'binary':
			if (params.state.value == 1) {
				// Power ON
				console.log('Yamaha - Power On');
				yamaha.powerOn()
					.then(function() {
						// Get current values
						utils.getCurrentValues(yamaha)
							.then(function(values) {
								gladys.deviceType.getByDevice(params.deviceType.device)
									.then(function(deviceTypes) {
										// Set deviceTypes values
										deviceTypes.forEach(function(deviceType) {
											switch (deviceType.identifier) {
											case 'power':
											case 'mute':
											case 'volume':
												utils.changeState(deviceType, values[deviceType.identifier])
													.then();
												break;

											default:
												break;
											}
										});
									});

								return resolve(values.power);
							});
					});
			} else {
				// Power OFF
				console.log('Yamaha - Power Off');
				yamaha.powerOff()
					.then(function() {
						// Get values after Power Off
						utils.getCurrentValues(yamaha)
							.then((values) => {
								return resolve(values.power);
							});
					});
			}
			break;

		case 'mute':
			yamaha.isOn()
				.then(function() {
					// Yamaha is On
					if (params.state.value == 1) {
						// Mute On
						console.log('Yamaha - Mute On');
						yamaha.muteOn()
							.then(function() {
								// Get values after Mute On
								utils.getCurrentValues(yamaha)
									.then((values) => {
										return resolve(values.mute);
									});
							});
					} else {
						// Mute Off
						console.log('Yamaha - Mute Off');
						yamaha.muteOff()
							.then(function() {
								// Get values after Mute Off
								utils.getCurrentValues(yamaha)
									.then((values) => {
										return resolve(values.mute);
									});
							});
					}
				})
				.then(function() {
					// Yamaha is Off, do nothing
					return reject();
				});
			break;

		case 'volume':
			yamaha.isOn()
				.then(function() {
					// Yamaha is On, fix volume value
					var value = math.round(params.state.value / 5) * 5;
					console.log(`Yamaha - setVolumeTo ${value / 10} dB`);

					// Set volume
					yamaha.setVolumeTo(value)
						.then(function() {
							// Get values after Volume change
							utils.getCurrentValues(yamaha)
								.then((values) => {
									return resolve(values.volume);
								});
						});
				})
				.then(function() {
					// Yamaha is Off, do nothing
					return reject();
				});
			break;
		}
	});
};