var setup = require('./setup.js');

module.exports = function() {
	var param = {
		name : 'YAMAHA_DEFAULT_INPUT',
		value : 'HDMI1'
	};

	// Check if the parameter exists
	return gladys.param.getValue(param.name)
		.catch(() => {
			// If not, we create it
			return gladys.param.setValue(param);
		})
		.then(setup);
};