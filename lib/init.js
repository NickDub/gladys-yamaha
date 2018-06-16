var shared = require('./shared.js');
var Yamaha = require('yamaha-nodejs');

module.exports = function init() {
	return gladys.device.getByService({
		service : 'yamaha'
	})
		.then((devices) => {

			// reset all instances 
			shared.instances = {};

			// for each device, create an instance
			devices.forEach(function(device) {
				shared.instances[device.id] = new Yamaha(device.identifier);
			});
		});
};