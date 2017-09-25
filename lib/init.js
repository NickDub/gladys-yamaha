var shared = require('./shared.js');
var Yamaha = require('yamaha-nodejs');

module.exports = function init() {

    return gladys.device.getByService({service: 'yamaha'})
        .then((devices) => {
            // reset all instances 
            shared.instances = {};

            devices.filter(({ protocol }) => protocol === 'wifi')
                .forEach(function(device) {
                    shared.instances[device.id] = new Yamaha(device.identifier);
            });
        })
        .catch((err) => {
            sails.log.warn(`Yamaha : Error while initializing Yamaha device in Gladys. ${err}`);
        });
};
