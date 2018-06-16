var Promise = require('bluebird');
var shared = require('./shared.js');

module.exports = function sendCommand(functionName, params, paramsArray) {
	return new Promise(function(resolve, reject) {
		if (!shared.instances[params.deviceType.device]) return reject(`No Yamaha receiver with deviceId ${params.deviceType.device}`);

		paramsArray = paramsArray || [];

		// add callback to paramsArray
		paramsArray.push(function(err, result) {
			if (err) return reject(err);

			resolve(result);
		});

		var yamaha = shared.instances[params.deviceType.device];

		yamaha.powerOn().then(function() {
			yamaha.setMainInputTo('PC').then(function() {
				console.log(`functionName: ${functionName}`);
				console.log(`params: ${JSON.stringify(params)}`);
				console.log(`paramsArray: ${paramsArray}`);

				// call the Yamaha Device function
				resolve(yamaha[functionName].apply(yamaha, paramsArray));
			});
		});
	});
};