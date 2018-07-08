var YamahaAPI = require('yamaha-nodejs');
var Promise = require('bluebird');
var utils = require('./utils.js');
var init = require('./init.js');
var i18n = require('./i18n.js');

module.exports = function setup() {

	var yamaha = new YamahaAPI();

	yamaha.getOrDiscoverIP()
		.then(function(ip) {
			console.log(`Yamaha - IP: ${ip}`);

			yamaha.getSystemConfig()
				.then(function(config) {
					var modelName = config.YAMAHA_AV.System[0].Config[0].Model_Name[0];
					console.log(`Yamaha - Model name: ${modelName}`);

					var newDevice = {
						device : {
							name : `Yamaha (${modelName})`,
							identifier : `${ip}`,
							protocol : `wifi`,
							service : `yamaha`
						},
						types : [
							{
								name : 'Power',
								type : 'binary',
								identifier : 'power',
								sensor : false,
								min : 0,
								max : 1
							},
							{
								name : 'Mute',
								type : 'binary',
								identifier : 'mute',
								sensor : false,
								min : 0,
								max : 1
							},
							{
								name : 'Volume',
								type : 'volume',
								identifier : 'volume',
								unit : 'dB (x10)',
								sensor : false,
								min : -800,
								max : 165
							},
							{
								name : 'Music',
								type : 'music',
								identifier : 'music',
								sensor : false,
								min : 0,
								max : 0
							}
						]
					};

					gladys.device.create(newDevice)
						.then(function(device) {
							// Get current values
							utils.getCurrentValues(yamaha)
								.then((values) => {
									// Set deviceTypes values
									device.types.forEach(function(deviceType) {
										switch (deviceType.identifier) {
										case 'power':
										case 'mute':
										case 'volume':
											utils.changeState(deviceType, values[deviceType.identifier]);
											break;

										default:
											break;
										}
									});
								});
						})
						/*.then(() => {
							// List available zones
							var zones = yamaha.getAvailableZones();

							return gladys.user.getAdmin()
								.then((admins) => {
									return Promise.map(admins, function(admin) {
										var language = admin.language.indexOf('fr') > -1 ? 'fr' : 'en';
										var message = i18n[language].availableZones;

										sails.log.info(message);
										return gladys.message.send({id : null}, {text : message, receiver : admin.id})
											.then(() => Promise.map(zones, function(zone) {
												var message = `- ` + zone;

												sails.log.info(message);
												return gladys.message.send({id : null}, {text : message, receiver : admin.id});
											})
										);
									});
								});
						})*/
						.then(() => {
							// List available inputs
							var inputs = yamaha.getAvailableInputs();

							return gladys.user.getAdmin()
								.then((admins) => {
									return Promise.map(admins, function(admin) {
										var language = admin.language.indexOf('fr') > -1 ? 'fr' : 'en';
										var message = i18n[language].availableInputs;

										sails.log.info(message);
										return gladys.message.send({id : null}, {text : message, receiver : admin.id})
											.then(() => Promise.map(inputs, function(input) {
												var message = `- ` + input;

												sails.log.info(message);
												return gladys.message.send({id : null}, {text : message, receiver : admin.id});
											})
										);
									});
								});
						})
						.then(init)
						.catch((err) => {
							console.log(`Yamaha - Error, device ${newDevice.name} not created!`);
							return Promise.reject(err);
						});
				});
		});

	return Promise.resolve();
};