
var YamahaAPI = require('yamaha-nodejs');
var Promise = require('bluebird');
var init = require('./init.js');

module.exports = function setup() {

	var yamaha = new YamahaAPI();

	yamaha.powerOn('System').then(function() {
		console.log('powerOn');
		yamaha.getOrDiscoverIP().then(function(ip) {
			console.log(`Yamaha - IP: ${ip}`);

			yamaha.getSystemConfig().then(function(config) {
				var modelName = config.YAMAHA_AV.System[0].Config[0].Model_Name[0];
				var newDevice = {
					device : {
						name : `Yamaha (${modelName})`,
						protocol : `wifi`,
						service : `yamaha`,
						identifier : `${ip}`
					},
					types : [ {
						name : 'Power',
						type : 'binary',
						identifier : 'power',
						sensor : false,
						min : 0,
						max : 1
					},
						{
							name : 'Music',
							type : 'music',
							identifier : 'music',
							sensor : false,
							min : 0,
							max : 0
						} ]
				};

				gladys.device.create(newDevice)
					.then(() => init());
			});
		});
	});

	return Promise.resolve();
};