var Promise = require('bluebird');
var shared = require('./shared.js');

module.exports = function exec(params) {

    if (!shared.instances[params.deviceType.device]) {
        return Promise.reject(new Error(`Yamaha : ${params.deviceType.device} not found`));
    }

    var isOn = false;
    var isMuted = false;
    var volume = -320;

    shared.instances[params.deviceType.device].getBasicInfo()
        .done(function(basicInfo) {
            isOn = basicInfo.isOn();
            isMuted = basicInfo.isMuted();
            volume = basicInfo.getVolume();
        });

    switch (params.deviceType.type) {
        case 'binary':
            if (!isOn) {
                sails.log.debug('Yamaha : powerOn');
                shared.instances[params.deviceType.device].powerOn();
            } else {
                sails.log.debug('Yamaha : powerOff');
                shared.instances[params.deviceType.device].powerOff();
            }
            break;
        case 'mute':
            if (!isMuted) {
                sails.log.debug('Yamaha : muteOn');
                shared.instances[params.deviceType.device].muteOn();
            } else {
                sails.log.debug('Yamaha : muteOff');
                shared.instances[params.deviceType.device].muteOff();
            }
            break;
        case 'volume':
            sails.log.debug('Yamaha : setVolumeTo ' + params.state.value);
            shared.instances[params.deviceType.device].setVolumeTo(params.state.value);
            break;
    };

    // We return true because Yamaha Receiver has a State feedback.
    // So device Exec should not create deviceState
    return Promise.resolve(true);
};
