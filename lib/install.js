module.exports = function() {
	var type = {
		name : 'Yamaha',
		service : 'yamaha'
	};

	return gladys.notification.install(type);
};