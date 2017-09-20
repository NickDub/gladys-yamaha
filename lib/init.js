var shared = require('./shared.js');
var Yamaha = require('yamaha-nodejs');

module.exports = function init() {

    return gladys.device.getByService({service: 'yamaha'})
        .then((devices) => {
            // reset all instances 
            shared.instances = {};

            devices.forEach(function(device) {
                if (device.protocol == 'wifi') {
                    shared.instances[device.id] = new Yamaha(device.identifier);
                }
            });
        });
};
