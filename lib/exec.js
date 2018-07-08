var Promise = require('bluebird');
var math = require('mathjs');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function exec(params) {
	console.log(`Yamaha - ${JSON.stringify(params)}`);
	return new Promise((resolve, reject) => {
		var yamaha = shared.instances[params.deviceType.device];
		if (!yamaha) return reject(`No Yamaha receiver with deviceId ${params.deviceType.device}`);

		switch (params.deviceType.deviceTypeIdentifier) {
		case 'power':
			if (params.state.value == 1) {
				// Power ON
				console.log('Yamaha - Power On');
				return yamaha.powerOn()
					.then(() => {
						gladys.param.getValue('YAMAHA_DEFAULT_INPUT')
							.then((input) => {
								// Set default input
								yamaha.setMainInputTo(input)
									.then(() => {
										// Set Gladys current volume
										setCurrentVolume(yamaha, params.deviceType.device)
											.then(() => {
												return resolve(params.state.value);
											});
									});
							})
							.catch((err) => {
								console.log(err.message);
								return reject(err);
							});
					});
			} else {
				// Power OFF
				console.log('Yamaha - Power Off');
				return yamaha.powerOff()
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
			return yamaha.isOn()
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
				.catch((err) => {
					// Yamaha is Off, do nothing
					return reject(err);
				});
			break;

		case 'volume':
			return yamaha.isOn()
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
				.catch((err) => {
					// Yamaha is Off, do nothing
					return reject(err);
				});
			break;

		default:
			console.error(`Yamaha - No exec function for this identifier (${params.deviceType.identifier})!`);
			return reject();
			break;
		}
	});
};

function setCurrentVolume(yamaha, device) {
	return utils.getCurrentValues(yamaha)
		.then(function(values) {
			gladys.deviceType.getByDevice(device)
				.then((deviceTypes) => {
					deviceTypes.forEach((deviceType) => {
						if (deviceType.identifier === 'volume') {
							return utils.changeState(deviceType, values.volume);
						}
					});
				});
		});

	return reject();
}